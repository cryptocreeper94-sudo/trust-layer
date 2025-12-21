use chrono::Utc;
use std::collections::VecDeque;
use std::sync::Arc;
use tokio::sync::RwLock;
use tracing::{info, warn};

use crate::crypto::{
    compute_merkle_root, hash_block_header, hash_bytes, hash_transaction, Keypair,
};
use crate::ledger::{Ledger, LedgerError};
use crate::types::{Account, Address, Block, BlockHeader, ChainConfig, Hash, Transaction};

#[derive(Debug)]
pub enum ConsensusError {
    InvalidBlock(String),
    InvalidTransaction(String),
    NotValidator,
    LedgerError(LedgerError),
}

impl From<LedgerError> for ConsensusError {
    fn from(err: LedgerError) -> Self {
        ConsensusError::LedgerError(err)
    }
}

pub struct ProofOfAuthority {
    config: ChainConfig,
    validators: Vec<Address>,
    current_validator_index: usize,
    keypair: Option<Keypair>,
    ledger: Arc<Ledger>,
    mempool: Arc<RwLock<VecDeque<Transaction>>>,
}

impl ProofOfAuthority {
    pub fn new(
        config: ChainConfig,
        ledger: Arc<Ledger>,
        keypair: Option<Keypair>,
    ) -> Self {
        let validators = config.genesis_validators.clone();
        Self {
            config,
            validators,
            current_validator_index: 0,
            keypair,
            ledger,
            mempool: Arc::new(RwLock::new(VecDeque::new())),
        }
    }

    pub fn add_validator(&mut self, address: Address) {
        if !self.validators.contains(&address) {
            self.validators.push(address);
            info!("Added validator: {:?}", hex::encode(address));
        }
    }

    pub fn is_validator(&self, address: &Address) -> bool {
        self.validators.contains(address)
    }

    pub fn current_validator(&self) -> Option<&Address> {
        self.validators.get(self.current_validator_index)
    }

    pub fn rotate_validator(&mut self) {
        if !self.validators.is_empty() {
            self.current_validator_index =
                (self.current_validator_index + 1) % self.validators.len();
        }
    }

    pub async fn submit_transaction(&self, tx: Transaction) -> Result<Hash, ConsensusError> {
        self.validate_transaction(&tx)?;

        let tx_hash = tx.hash;
        let mut mempool = self.mempool.write().await;
        mempool.push_back(tx);

        info!("Transaction added to mempool: {:?}", hex::encode(tx_hash));
        Ok(tx_hash)
    }

    pub fn validate_transaction(&self, tx: &Transaction) -> Result<(), ConsensusError> {
        if tx.gas_limit == 0 {
            return Err(ConsensusError::InvalidTransaction(
                "Gas limit cannot be zero".to_string(),
            ));
        }

        if tx.from == tx.to {
            return Err(ConsensusError::InvalidTransaction(
                "Cannot send to self".to_string(),
            ));
        }

        Ok(())
    }

    pub async fn produce_block(&mut self) -> Result<Block, ConsensusError> {
        let keypair = self
            .keypair
            .as_ref()
            .ok_or(ConsensusError::NotValidator)?;

        let validator_address = keypair.address();
        if !self.is_validator(&validator_address) {
            return Err(ConsensusError::NotValidator);
        }

        let prev_block = self.ledger.get_latest_block()?;
        let new_height = prev_block.header.height + 1;

        let mut transactions = Vec::new();
        {
            let mut mempool = self.mempool.write().await;
            let max_txs = self.config.max_tx_per_block.min(mempool.len());
            for _ in 0..max_txs {
                if let Some(tx) = mempool.pop_front() {
                    transactions.push(tx);
                }
            }
        }

        for tx in &transactions {
            if let Err(e) = self.ledger.apply_transaction(tx) {
                warn!("Failed to apply transaction: {:?}", e);
            }
        }

        let tx_hashes: Vec<Hash> = transactions.iter().map(|tx| tx.hash).collect();
        let merkle_root = compute_merkle_root(&tx_hashes);

        let state_root = hash_bytes(&new_height.to_be_bytes());

        let mut header = BlockHeader {
            version: 1,
            height: new_height,
            timestamp: Utc::now(),
            prev_hash: prev_block.hash,
            merkle_root,
            state_root,
            validator: validator_address,
            signature: [0u8; 64],
        };

        let header_hash = hash_block_header(&header);
        header.signature = keypair.sign(&header_hash);

        let block_hash = hash_block_header(&header);

        let block = Block {
            header,
            transactions,
            hash: block_hash,
        };

        self.ledger.store_block(&block)?;
        self.rotate_validator();

        info!(
            "Produced block #{} with {} transactions",
            new_height,
            block.tx_count()
        );

        Ok(block)
    }

    pub fn validate_block(&self, block: &Block) -> Result<(), ConsensusError> {
        if block.header.height == 0 {
            return Ok(());
        }

        let prev_block = self
            .ledger
            .get_block(block.header.height - 1)
            .map_err(|_| {
                ConsensusError::InvalidBlock("Previous block not found".to_string())
            })?;

        if block.header.prev_hash != prev_block.hash {
            return Err(ConsensusError::InvalidBlock(
                "Invalid previous hash".to_string(),
            ));
        }

        if !self.is_validator(&block.header.validator) {
            return Err(ConsensusError::InvalidBlock(
                "Block producer is not a validator".to_string(),
            ));
        }

        let tx_hashes: Vec<Hash> = block.transactions.iter().map(|tx| tx.hash).collect();
        let computed_merkle = compute_merkle_root(&tx_hashes);
        if computed_merkle != block.header.merkle_root {
            return Err(ConsensusError::InvalidBlock(
                "Invalid merkle root".to_string(),
            ));
        }

        Ok(())
    }

    pub async fn mempool_size(&self) -> usize {
        self.mempool.read().await.len()
    }

    pub fn validator_count(&self) -> usize {
        self.validators.len()
    }
}

pub async fn start_block_producer(
    consensus: Arc<RwLock<ProofOfAuthority>>,
    block_time_ms: u64,
) {
    info!("Starting block producer with {}ms block time", block_time_ms);

    loop {
        tokio::time::sleep(tokio::time::Duration::from_millis(block_time_ms)).await;

        let mut consensus = consensus.write().await;
        match consensus.produce_block().await {
            Ok(block) => {
                info!("Block #{} produced successfully", block.header.height);
            }
            Err(ConsensusError::NotValidator) => {
            }
            Err(e) => {
                warn!("Failed to produce block: {:?}", e);
            }
        }
    }
}
