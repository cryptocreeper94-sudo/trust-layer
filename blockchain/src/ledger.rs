use sled::Db;
use std::path::Path;
use std::sync::Arc;
use thiserror::Error;

use crate::crypto::hash_to_hex;
use crate::types::{Account, Address, Block, Hash, Transaction};

#[derive(Error, Debug)]
pub enum LedgerError {
    #[error("Database error: {0}")]
    DatabaseError(String),
    #[error("Block not found: {0}")]
    BlockNotFound(String),
    #[error("Account not found")]
    AccountNotFound,
    #[error("Insufficient balance")]
    InsufficientBalance,
    #[error("Invalid nonce")]
    InvalidNonce,
    #[error("Serialization error: {0}")]
    SerializationError(String),
}

impl From<sled::Error> for LedgerError {
    fn from(err: sled::Error) -> Self {
        LedgerError::DatabaseError(err.to_string())
    }
}

pub struct Ledger {
    db: Arc<Db>,
    blocks_tree: sled::Tree,
    accounts_tree: sled::Tree,
    txs_tree: sled::Tree,
    meta_tree: sled::Tree,
}

impl Ledger {
    pub fn new<P: AsRef<Path>>(path: P) -> Result<Self, LedgerError> {
        let db = sled::open(path)?;
        let blocks_tree = db.open_tree("blocks")?;
        let accounts_tree = db.open_tree("accounts")?;
        let txs_tree = db.open_tree("transactions")?;
        let meta_tree = db.open_tree("meta")?;

        Ok(Self {
            db: Arc::new(db),
            blocks_tree,
            accounts_tree,
            txs_tree,
            meta_tree,
        })
    }

    pub fn in_memory() -> Result<Self, LedgerError> {
        let config = sled::Config::new().temporary(true);
        let db = config.open()?;
        let blocks_tree = db.open_tree("blocks")?;
        let accounts_tree = db.open_tree("accounts")?;
        let txs_tree = db.open_tree("transactions")?;
        let meta_tree = db.open_tree("meta")?;

        Ok(Self {
            db: Arc::new(db),
            blocks_tree,
            accounts_tree,
            txs_tree,
            meta_tree,
        })
    }

    pub fn init_genesis(&self, genesis: &Block) -> Result<(), LedgerError> {
        self.store_block(genesis)?;
        self.set_latest_height(0)?;
        Ok(())
    }

    pub fn store_block(&self, block: &Block) -> Result<(), LedgerError> {
        let key = block.header.height.to_be_bytes();
        let value =
            bincode::serialize(block).map_err(|e| LedgerError::SerializationError(e.to_string()))?;

        self.blocks_tree.insert(key, value)?;

        let hash_key = format!("hash:{}", hash_to_hex(&block.hash));
        self.blocks_tree
            .insert(hash_key.as_bytes(), block.header.height.to_be_bytes().to_vec())?;

        for tx in &block.transactions {
            self.store_transaction(tx)?;
        }

        self.set_latest_height(block.header.height)?;
        self.db.flush()?;

        Ok(())
    }

    pub fn get_block(&self, height: u64) -> Result<Block, LedgerError> {
        let key = height.to_be_bytes();
        let value = self
            .blocks_tree
            .get(key)?
            .ok_or_else(|| LedgerError::BlockNotFound(format!("height: {}", height)))?;

        bincode::deserialize(&value).map_err(|e| LedgerError::SerializationError(e.to_string()))
    }

    pub fn get_block_by_hash(&self, hash: &Hash) -> Result<Block, LedgerError> {
        let hash_key = format!("hash:{}", hash_to_hex(hash));
        let height_bytes = self
            .blocks_tree
            .get(hash_key.as_bytes())?
            .ok_or_else(|| LedgerError::BlockNotFound(hash_to_hex(hash)))?;

        let mut height_arr = [0u8; 8];
        height_arr.copy_from_slice(&height_bytes);
        let height = u64::from_be_bytes(height_arr);

        self.get_block(height)
    }

    pub fn get_latest_block(&self) -> Result<Block, LedgerError> {
        let height = self.get_latest_height()?;
        self.get_block(height)
    }

    pub fn get_latest_height(&self) -> Result<u64, LedgerError> {
        let value = self
            .meta_tree
            .get(b"latest_height")?
            .unwrap_or_else(|| sled::IVec::from(&[0u8; 8]));

        let mut arr = [0u8; 8];
        arr.copy_from_slice(&value);
        Ok(u64::from_be_bytes(arr))
    }

    fn set_latest_height(&self, height: u64) -> Result<(), LedgerError> {
        self.meta_tree
            .insert(b"latest_height", &height.to_be_bytes())?;
        Ok(())
    }

    pub fn store_transaction(&self, tx: &Transaction) -> Result<(), LedgerError> {
        let value =
            bincode::serialize(tx).map_err(|e| LedgerError::SerializationError(e.to_string()))?;
        self.txs_tree.insert(&tx.hash, value)?;
        Ok(())
    }

    pub fn get_transaction(&self, hash: &Hash) -> Result<Transaction, LedgerError> {
        let value = self
            .txs_tree
            .get(hash)?
            .ok_or_else(|| LedgerError::BlockNotFound(hash_to_hex(hash)))?;

        bincode::deserialize(&value).map_err(|e| LedgerError::SerializationError(e.to_string()))
    }

    pub fn get_account(&self, address: &Address) -> Result<Account, LedgerError> {
        match self.accounts_tree.get(address)? {
            Some(value) => bincode::deserialize(&value)
                .map_err(|e| LedgerError::SerializationError(e.to_string())),
            None => Ok(Account::new(*address)),
        }
    }

    pub fn update_account(&self, account: &Account) -> Result<(), LedgerError> {
        let value = bincode::serialize(account)
            .map_err(|e| LedgerError::SerializationError(e.to_string()))?;
        self.accounts_tree.insert(&account.address, value)?;
        Ok(())
    }

    pub fn get_balance(&self, address: &Address) -> Result<u64, LedgerError> {
        Ok(self.get_account(address)?.balance)
    }

    pub fn transfer(
        &self,
        from: &Address,
        to: &Address,
        amount: u64,
    ) -> Result<(), LedgerError> {
        let mut from_account = self.get_account(from)?;
        let mut to_account = self.get_account(to)?;

        if from_account.balance < amount {
            return Err(LedgerError::InsufficientBalance);
        }

        from_account.balance -= amount;
        from_account.nonce += 1;
        to_account.balance += amount;

        self.update_account(&from_account)?;
        self.update_account(&to_account)?;

        Ok(())
    }

    pub fn apply_transaction(&self, tx: &Transaction) -> Result<(), LedgerError> {
        let mut from_account = self.get_account(&tx.from)?;

        if from_account.nonce != tx.nonce {
            return Err(LedgerError::InvalidNonce);
        }

        let total_cost = tx.total_cost();
        if from_account.balance < total_cost {
            return Err(LedgerError::InsufficientBalance);
        }

        from_account.balance -= total_cost;
        from_account.nonce += 1;

        let mut to_account = self.get_account(&tx.to)?;
        to_account.balance += tx.amount;

        self.update_account(&from_account)?;
        self.update_account(&to_account)?;

        Ok(())
    }

    pub fn get_total_accounts(&self) -> Result<u64, LedgerError> {
        Ok(self.accounts_tree.len() as u64)
    }

    pub fn get_total_transactions(&self) -> Result<u64, LedgerError> {
        Ok(self.txs_tree.len() as u64)
    }

    pub fn mint(&self, address: &Address, amount: u64) -> Result<(), LedgerError> {
        let mut account = self.get_account(address)?;
        account.balance += amount;
        self.update_account(&account)?;
        Ok(())
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_in_memory_ledger() {
        let ledger = Ledger::in_memory().unwrap();
        let genesis = Block::genesis();
        ledger.init_genesis(&genesis).unwrap();

        let retrieved = ledger.get_block(0).unwrap();
        assert_eq!(retrieved.header.height, 0);
    }

    #[test]
    fn test_account_operations() {
        let ledger = Ledger::in_memory().unwrap();
        let address = [1u8; 20];

        ledger.mint(&address, 1000).unwrap();
        let balance = ledger.get_balance(&address).unwrap();
        assert_eq!(balance, 1000);
    }
}
