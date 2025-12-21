use clap::Parser;
use orbit_chain::node::{init_logging, Node};
use orbit_chain::types::ChainConfig;

#[derive(Parser, Debug)]
#[command(name = "darkwave-chain")]
#[command(author = "DarkWave Studios")]
#[command(version = "0.1.0")]
#[command(about = "DarkWave Chain - Fast, secure Layer 1 blockchain")]
struct Args {
    #[arg(long, default_value = "3030")]
    rpc_port: u16,

    #[arg(long)]
    data_dir: Option<String>,

    #[arg(long, default_value = "1337")]
    chain_id: u64,

    #[arg(long, default_value = "400")]
    block_time: u64,
}

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    init_logging();

    let args = Args::parse();

    let config = ChainConfig {
        chain_id: 8453, // Matching DarkWave Token contract
        chain_name: "DarkWave Chain".to_string(),
        symbol: "DWT".to_string(),
        decimals: 18,
        block_time_ms: args.block_time,
        max_block_size: 1_000_000,
        max_tx_per_block: 10_000,
        genesis_validators: vec![],
    };

    let node = Node::new(config, args.data_dir.as_deref())?;
    node.start(args.rpc_port).await?;

    Ok(())
}
