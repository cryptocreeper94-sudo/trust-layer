use serde::{Deserialize, Serialize};
use chrono::{DateTime, Utc};

pub type Hash = [u8; 32];
pub type PublicKey = [u8; 32];
pub type Signature = [u8; 64];
pub type Address = [u8; 20];

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub struct Transaction {
    pub hash: Hash,
    pub from: Address,
    pub to: Address,
    pub amount: u64,
    pub nonce: u64,
    pub gas_limit: u64,
    pub gas_price: u64,
    pub data: Vec<u8>,
    pub signature: Signature,
    pub timestamp: DateTime<Utc>,
}

impl Transaction {
    pub fn new(
        from: Address,
        to: Address,
        amount: u64,
        nonce: u64,
        gas_limit: u64,
        gas_price: u64,
        data: Vec<u8>,
    ) -> Self {
        Self {
            hash: [0u8; 32],
            from,
            to,
            amount,
            nonce,
            gas_limit,
            gas_price,
            data,
            signature: [0u8; 64],
            timestamp: Utc::now(),
        }
    }

    pub fn total_cost(&self) -> u64 {
        self.amount + (self.gas_limit * self.gas_price)
    }
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct BlockHeader {
    pub version: u32,
    pub height: u64,
    pub timestamp: DateTime<Utc>,
    pub prev_hash: Hash,
    pub merkle_root: Hash,
    pub state_root: Hash,
    pub validator: Address,
    pub signature: Signature,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Block {
    pub header: BlockHeader,
    pub transactions: Vec<Transaction>,
    pub hash: Hash,
}

impl Block {
    pub fn genesis() -> Self {
        let header = BlockHeader {
            version: 1,
            height: 0,
            timestamp: Utc::now(),
            prev_hash: [0u8; 32],
            merkle_root: [0u8; 32],
            state_root: [0u8; 32],
            validator: [0u8; 20],
            signature: [0u8; 64],
        };

        Self {
            header,
            transactions: vec![],
            hash: [0u8; 32],
        }
    }

    pub fn tx_count(&self) -> usize {
        self.transactions.len()
    }
}

#[derive(Debug, Clone, Serialize, Deserialize, Default)]
pub struct Account {
    pub address: Address,
    pub balance: u64,
    pub nonce: u64,
    pub code_hash: Option<Hash>,
    pub storage_root: Option<Hash>,
}

impl Account {
    pub fn new(address: Address) -> Self {
        Self {
            address,
            balance: 0,
            nonce: 0,
            code_hash: None,
            storage_root: None,
        }
    }

    pub fn with_balance(address: Address, balance: u64) -> Self {
        Self {
            address,
            balance,
            nonce: 0,
            code_hash: None,
            storage_root: None,
        }
    }
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ChainConfig {
    pub chain_id: u64,
    pub chain_name: String,
    pub symbol: String,
    pub decimals: u8,
    pub block_time_ms: u64,
    pub max_block_size: usize,
    pub max_tx_per_block: usize,
    pub genesis_validators: Vec<Address>,
}

impl Default for ChainConfig {
    fn default() -> Self {
        Self {
            chain_id: 1337,
            chain_name: "Orbit Chain".to_string(),
            symbol: "ORB".to_string(),
            decimals: 18,
            block_time_ms: 400,
            max_block_size: 1_000_000,
            max_tx_per_block: 10_000,
            genesis_validators: vec![],
        }
    }
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct NetworkStats {
    pub tps: f64,
    pub block_height: u64,
    pub total_transactions: u64,
    pub active_validators: usize,
    pub total_accounts: u64,
    pub total_supply: u64,
}
