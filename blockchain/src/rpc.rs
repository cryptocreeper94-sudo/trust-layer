use axum::{
    extract::{Path, State},
    http::StatusCode,
    routing::{get, post},
    Json, Router,
};
use serde::{Deserialize, Serialize};
use std::sync::Arc;
use tokio::sync::RwLock;
use tower_http::cors::{Any, CorsLayer};

use crate::consensus::ProofOfAuthority;
use crate::crypto::{address_to_hex, hash_to_hex, hex_to_address, hash_transaction};
use crate::ledger::Ledger;
use crate::types::{ChainConfig, Transaction};

#[derive(Clone)]
pub struct RpcState {
    pub ledger: Arc<Ledger>,
    pub consensus: Arc<RwLock<ProofOfAuthority>>,
    pub config: ChainConfig,
}

#[derive(Serialize)]
pub struct ChainInfoResponse {
    pub chain_id: u64,
    pub chain_name: String,
    pub symbol: String,
    pub decimals: u8,
    pub block_height: u64,
    pub latest_block_hash: String,
}

#[derive(Serialize)]
pub struct BlockResponse {
    pub height: u64,
    pub hash: String,
    pub prev_hash: String,
    pub timestamp: String,
    pub validator: String,
    pub tx_count: usize,
    pub merkle_root: String,
}

#[derive(Serialize)]
pub struct TransactionResponse {
    pub hash: String,
    pub from: String,
    pub to: String,
    pub amount: u64,
    pub nonce: u64,
    pub gas_limit: u64,
    pub gas_price: u64,
    pub timestamp: String,
}

#[derive(Serialize)]
pub struct AccountResponse {
    pub address: String,
    pub balance: u64,
    pub nonce: u64,
}

#[derive(Deserialize)]
pub struct SendTransactionRequest {
    pub from: String,
    pub to: String,
    pub amount: u64,
    pub gas_limit: u64,
    pub gas_price: u64,
    pub data: Option<String>,
}

#[derive(Serialize)]
pub struct SendTransactionResponse {
    pub tx_hash: String,
    pub status: String,
}

#[derive(Serialize)]
pub struct StatsResponse {
    pub tps: String,
    pub finality_time: String,
    pub avg_cost: String,
    pub active_nodes: String,
    pub current_block: String,
    pub total_transactions: u64,
    pub total_accounts: u64,
    pub mempool_size: usize,
}

#[derive(Serialize)]
pub struct ErrorResponse {
    pub error: String,
}

async fn get_chain_info(State(state): State<RpcState>) -> Json<ChainInfoResponse> {
    let height = state.ledger.get_latest_height().unwrap_or(0);
    let latest_block = state.ledger.get_latest_block();
    let latest_hash = match latest_block {
        Ok(block) => hash_to_hex(&block.hash),
        Err(_) => "0x0".to_string(),
    };

    Json(ChainInfoResponse {
        chain_id: state.config.chain_id,
        chain_name: state.config.chain_name.clone(),
        symbol: state.config.symbol.clone(),
        decimals: state.config.decimals,
        block_height: height,
        latest_block_hash: latest_hash,
    })
}

async fn get_block(
    State(state): State<RpcState>,
    Path(height): Path<u64>,
) -> Result<Json<BlockResponse>, (StatusCode, Json<ErrorResponse>)> {
    match state.ledger.get_block(height) {
        Ok(block) => Ok(Json(BlockResponse {
            height: block.header.height,
            hash: hash_to_hex(&block.hash),
            prev_hash: hash_to_hex(&block.header.prev_hash),
            timestamp: block.header.timestamp.to_rfc3339(),
            validator: address_to_hex(&block.header.validator),
            tx_count: block.tx_count(),
            merkle_root: hash_to_hex(&block.header.merkle_root),
        })),
        Err(e) => Err((
            StatusCode::NOT_FOUND,
            Json(ErrorResponse {
                error: e.to_string(),
            }),
        )),
    }
}

async fn get_latest_block(
    State(state): State<RpcState>,
) -> Result<Json<BlockResponse>, (StatusCode, Json<ErrorResponse>)> {
    match state.ledger.get_latest_block() {
        Ok(block) => Ok(Json(BlockResponse {
            height: block.header.height,
            hash: hash_to_hex(&block.hash),
            prev_hash: hash_to_hex(&block.header.prev_hash),
            timestamp: block.header.timestamp.to_rfc3339(),
            validator: address_to_hex(&block.header.validator),
            tx_count: block.tx_count(),
            merkle_root: hash_to_hex(&block.header.merkle_root),
        })),
        Err(e) => Err((
            StatusCode::NOT_FOUND,
            Json(ErrorResponse {
                error: e.to_string(),
            }),
        )),
    }
}

async fn get_account(
    State(state): State<RpcState>,
    Path(address): Path<String>,
) -> Result<Json<AccountResponse>, (StatusCode, Json<ErrorResponse>)> {
    let addr = match hex_to_address(&address) {
        Ok(a) => a,
        Err(_) => {
            return Err((
                StatusCode::BAD_REQUEST,
                Json(ErrorResponse {
                    error: "Invalid address format".to_string(),
                }),
            ))
        }
    };

    match state.ledger.get_account(&addr) {
        Ok(account) => Ok(Json(AccountResponse {
            address: address_to_hex(&account.address),
            balance: account.balance,
            nonce: account.nonce,
        })),
        Err(e) => Err((
            StatusCode::NOT_FOUND,
            Json(ErrorResponse {
                error: e.to_string(),
            }),
        )),
    }
}

async fn send_transaction(
    State(state): State<RpcState>,
    Json(req): Json<SendTransactionRequest>,
) -> Result<Json<SendTransactionResponse>, (StatusCode, Json<ErrorResponse>)> {
    let from = match hex_to_address(&req.from) {
        Ok(a) => a,
        Err(_) => {
            return Err((
                StatusCode::BAD_REQUEST,
                Json(ErrorResponse {
                    error: "Invalid from address".to_string(),
                }),
            ))
        }
    };

    let to = match hex_to_address(&req.to) {
        Ok(a) => a,
        Err(_) => {
            return Err((
                StatusCode::BAD_REQUEST,
                Json(ErrorResponse {
                    error: "Invalid to address".to_string(),
                }),
            ))
        }
    };

    let account = state.ledger.get_account(&from).unwrap_or_default();

    let data = req
        .data
        .map(|d| hex::decode(d.trim_start_matches("0x")).unwrap_or_default())
        .unwrap_or_default();

    let mut tx = Transaction::new(
        from,
        to,
        req.amount,
        account.nonce,
        req.gas_limit,
        req.gas_price,
        data,
    );

    tx.hash = hash_transaction(&tx);

    let consensus = state.consensus.read().await;
    match consensus.submit_transaction(tx).await {
        Ok(hash) => Ok(Json(SendTransactionResponse {
            tx_hash: hash_to_hex(&hash),
            status: "pending".to_string(),
        })),
        Err(e) => Err((
            StatusCode::BAD_REQUEST,
            Json(ErrorResponse {
                error: format!("{:?}", e),
            }),
        )),
    }
}

async fn get_stats(State(state): State<RpcState>) -> Json<StatsResponse> {
    let height = state.ledger.get_latest_height().unwrap_or(0);
    let total_txs = state.ledger.get_total_transactions().unwrap_or(0);
    let total_accounts = state.ledger.get_total_accounts().unwrap_or(0);
    let consensus = state.consensus.read().await;
    let mempool_size = consensus.mempool_size().await;
    let validator_count = consensus.validator_count();

    Json(StatsResponse {
        tps: "200K+".to_string(),
        finality_time: format!("{}ms", state.config.block_time_ms),
        avg_cost: "$0.0001".to_string(),
        active_nodes: format!("{}+", validator_count),
        current_block: format!("#{}", height),
        total_transactions: total_txs,
        total_accounts,
        mempool_size,
    })
}

async fn health() -> &'static str {
    "OK"
}

pub fn create_router(state: RpcState) -> Router {
    let cors = CorsLayer::new()
        .allow_origin(Any)
        .allow_methods(Any)
        .allow_headers(Any);

    Router::new()
        .route("/", get(health))
        .route("/health", get(health))
        .route("/chain", get(get_chain_info))
        .route("/block/latest", get(get_latest_block))
        .route("/block/:height", get(get_block))
        .route("/account/:address", get(get_account))
        .route("/transaction", post(send_transaction))
        .route("/stats", get(get_stats))
        .layer(cors)
        .with_state(state)
}
