use std::sync::Arc;
use tokio::sync::RwLock;
use tracing::{info, Level};
use tracing_subscriber::FmtSubscriber;

use crate::consensus::{start_block_producer, ProofOfAuthority};
use crate::crypto::Keypair;
use crate::ledger::Ledger;
use crate::rpc::{create_router, RpcState};
use crate::types::{Block, ChainConfig};

pub struct Node {
    pub config: ChainConfig,
    pub ledger: Arc<Ledger>,
    pub consensus: Arc<RwLock<ProofOfAuthority>>,
    pub keypair: Keypair,
}

impl Node {
    pub fn new(config: ChainConfig, data_dir: Option<&str>) -> Result<Self, Box<dyn std::error::Error>> {
        let ledger = match data_dir {
            Some(path) => Arc::new(Ledger::new(path)?),
            None => Arc::new(Ledger::in_memory()?),
        };

        let keypair = Keypair::generate();
        let validator_address = keypair.address();

        let mut chain_config = config.clone();
        chain_config.genesis_validators.push(validator_address);

        let consensus = ProofOfAuthority::new(
            chain_config.clone(),
            Arc::clone(&ledger),
            Some(keypair.clone()),
        );

        let genesis = Block::genesis();
        if ledger.get_latest_height().unwrap_or(0) == 0 {
            ledger.init_genesis(&genesis)?;
            info!("Genesis block initialized");
        }

        // 100 million DARK with 8 decimals = 100_000_000 * 10^8
        ledger.mint(&validator_address, 10_000_000_000_000_000)?;
        info!(
            "Minted 100,000,000 DARK to validator: 0x{}",
            hex::encode(validator_address)
        );

        Ok(Self {
            config: chain_config,
            ledger,
            consensus: Arc::new(RwLock::new(consensus)),
            keypair,
        })
    }

    pub async fn start(&self, rpc_port: u16) -> Result<(), Box<dyn std::error::Error>> {
        info!("===========================================");
        info!("      DARKWAVE CHAIN NODE STARTING");
        info!("===========================================");
        info!("Chain ID: {}", self.config.chain_id);
        info!("Chain Name: {}", self.config.chain_name);
        info!("Symbol: {}", self.config.symbol);
        info!("Block Time: {}ms", self.config.block_time_ms);
        info!("RPC Port: {}", rpc_port);
        info!(
            "Validator Address: 0x{}",
            hex::encode(self.keypair.address())
        );
        info!("===========================================");

        let block_producer_consensus = Arc::clone(&self.consensus);
        let block_time = self.config.block_time_ms;
        tokio::spawn(async move {
            start_block_producer(block_producer_consensus, block_time).await;
        });

        let rpc_state = RpcState {
            ledger: Arc::clone(&self.ledger),
            consensus: Arc::clone(&self.consensus),
            config: self.config.clone(),
        };

        let router = create_router(rpc_state);

        let addr = format!("0.0.0.0:{}", rpc_port);
        info!("RPC server listening on {}", addr);

        let listener = tokio::net::TcpListener::bind(&addr).await?;
        axum::serve(listener, router).await?;

        Ok(())
    }
}

pub fn init_logging() {
    let subscriber = FmtSubscriber::builder()
        .with_max_level(Level::INFO)
        .with_target(false)
        .with_thread_ids(false)
        .with_file(false)
        .with_line_number(false)
        .compact()
        .finish();

    tracing::subscriber::set_global_default(subscriber).expect("Failed to set subscriber");
}
