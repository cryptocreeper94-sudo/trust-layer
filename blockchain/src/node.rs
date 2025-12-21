use std::sync::Arc;
use std::path::PathBuf;
use std::env;
use tokio::sync::RwLock;
use tracing::{info, warn, Level};
use tracing_subscriber::FmtSubscriber;

use crate::consensus::{start_block_producer, ProofOfAuthority};
use crate::crypto::Keypair;
use crate::ledger::Ledger;
use crate::rpc::{create_router, RpcState};
use crate::types::{Block, ChainConfig};

const TREASURY_KEY_ENV: &str = "TREASURY_PRIVATE_KEY";
const TOTAL_SUPPLY: u128 = 100_000_000 * 1_000_000_000_000_000_000u128; // 100M DWT with 18 decimals

pub struct Node {
    pub config: ChainConfig,
    pub ledger: Arc<Ledger>,
    pub consensus: Arc<RwLock<ProofOfAuthority>>,
    pub keypair: Keypair,
}

impl Node {
    pub fn new(config: ChainConfig, data_dir: Option<&str>) -> Result<Self, Box<dyn std::error::Error>> {
        let data_path = data_dir.map(PathBuf::from).unwrap_or_else(|| PathBuf::from("data"));
        
        std::fs::create_dir_all(&data_path)?;
        
        let ledger = Arc::new(Ledger::new(&data_path)?);

        let (keypair, is_new_key) = Self::load_treasury_keypair()?;
        
        let validator_address = keypair.address();

        if is_new_key {
            info!("Generated NEW treasury wallet");
            info!("IMPORTANT: Set {} environment variable with this key to persist:", TREASURY_KEY_ENV);
            info!("Treasury Private Key: {}", keypair.to_hex());
            warn!("Without setting this secret, a new wallet will be generated on restart!");
        } else {
            info!("Loaded treasury wallet from secure environment");
        }

        let mut chain_config = config.clone();
        chain_config.genesis_validators.push(validator_address);

        let consensus = ProofOfAuthority::new(
            chain_config.clone(),
            Arc::clone(&ledger),
            Some(keypair.clone()),
        );

        let is_genesis = ledger.get_latest_height().unwrap_or(0) == 0;
        
        if is_genesis {
            let genesis = Block::genesis();
            ledger.init_genesis(&genesis)?;
            info!("Genesis block initialized");
            
            ledger.mint(&validator_address, TOTAL_SUPPLY)?;
            info!(
                "Minted 100,000,000 DWT to treasury: 0x{}",
                hex::encode(validator_address)
            );
        } else {
            let balance = ledger.get_balance(&validator_address).unwrap_or(0);
            let display_balance = balance / 1_000_000_000_000_000_000u128;
            info!(
                "Treasury balance: {} DWT (0x{})",
                display_balance,
                hex::encode(validator_address)
            );
        }

        Ok(Self {
            config: chain_config,
            ledger,
            consensus: Arc::new(RwLock::new(consensus)),
            keypair,
        })
    }
    
    pub fn treasury_address(&self) -> String {
        format!("0x{}", hex::encode(self.keypair.address()))
    }
    
    pub fn treasury_private_key(&self) -> String {
        self.keypair.to_hex()
    }
    
    fn load_treasury_keypair() -> Result<(Keypair, bool), Box<dyn std::error::Error>> {
        if let Ok(key_hex) = env::var(TREASURY_KEY_ENV) {
            let keypair = Keypair::from_hex(&key_hex)
                .map_err(|e| format!("Invalid {} format: {}", TREASURY_KEY_ENV, e))?;
            Ok((keypair, false))
        } else {
            let keypair = Keypair::generate();
            Ok((keypair, true))
        }
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
