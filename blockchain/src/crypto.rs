use ed25519_dalek::{Signer, SigningKey, Verifier, VerifyingKey};
use rand::rngs::OsRng;
use sha2::{Digest, Sha256};
use thiserror::Error;

use crate::types::{Address, Hash, PublicKey, Signature};

#[derive(Error, Debug)]
pub enum CryptoError {
    #[error("Invalid signature")]
    InvalidSignature,
    #[error("Invalid public key")]
    InvalidPublicKey,
    #[error("Signing failed: {0}")]
    SigningError(String),
}

#[derive(Clone)]
pub struct Keypair {
    signing_key: SigningKey,
}

impl Keypair {
    pub fn generate() -> Self {
        let mut csprng = OsRng;
        let signing_key = SigningKey::generate(&mut csprng);
        Self { signing_key }
    }

    pub fn from_bytes(bytes: &[u8; 32]) -> Result<Self, CryptoError> {
        let signing_key = SigningKey::from_bytes(bytes);
        Ok(Self { signing_key })
    }

    pub fn public_key(&self) -> PublicKey {
        let verifying_key = self.signing_key.verifying_key();
        verifying_key.to_bytes()
    }

    pub fn address(&self) -> Address {
        public_key_to_address(&self.public_key())
    }

    pub fn sign(&self, message: &[u8]) -> Signature {
        let signature = self.signing_key.sign(message);
        signature.to_bytes()
    }

    pub fn to_bytes(&self) -> [u8; 32] {
        self.signing_key.to_bytes()
    }
}

pub fn public_key_to_address(public_key: &PublicKey) -> Address {
    let hash = hash_bytes(public_key);
    let mut address = [0u8; 20];
    address.copy_from_slice(&hash[12..32]);
    address
}

pub fn hash_bytes(data: &[u8]) -> Hash {
    let mut hasher = Sha256::new();
    hasher.update(data);
    let result = hasher.finalize();
    let mut hash = [0u8; 32];
    hash.copy_from_slice(&result);
    hash
}

pub fn hash_transaction(tx: &crate::types::Transaction) -> Hash {
    let mut data = Vec::new();
    data.extend_from_slice(&tx.from);
    data.extend_from_slice(&tx.to);
    data.extend_from_slice(&tx.amount.to_le_bytes());
    data.extend_from_slice(&tx.nonce.to_le_bytes());
    data.extend_from_slice(&tx.gas_limit.to_le_bytes());
    data.extend_from_slice(&tx.gas_price.to_le_bytes());
    data.extend_from_slice(&tx.data);
    hash_bytes(&data)
}

pub fn hash_block_header(header: &crate::types::BlockHeader) -> Hash {
    let mut data = Vec::new();
    data.extend_from_slice(&header.version.to_le_bytes());
    data.extend_from_slice(&header.height.to_le_bytes());
    data.extend_from_slice(&header.timestamp.timestamp().to_le_bytes());
    data.extend_from_slice(&header.prev_hash);
    data.extend_from_slice(&header.merkle_root);
    data.extend_from_slice(&header.state_root);
    data.extend_from_slice(&header.validator);
    hash_bytes(&data)
}

pub fn verify_signature(
    public_key: &PublicKey,
    message: &[u8],
    signature: &Signature,
) -> Result<(), CryptoError> {
    let verifying_key =
        VerifyingKey::from_bytes(public_key).map_err(|_| CryptoError::InvalidPublicKey)?;

    let sig = ed25519_dalek::Signature::from_bytes(signature);

    verifying_key
        .verify(message, &sig)
        .map_err(|_| CryptoError::InvalidSignature)
}

pub fn compute_merkle_root(hashes: &[Hash]) -> Hash {
    if hashes.is_empty() {
        return [0u8; 32];
    }
    if hashes.len() == 1 {
        return hashes[0];
    }

    let mut current_level: Vec<Hash> = hashes.to_vec();

    while current_level.len() > 1 {
        let mut next_level = Vec::new();

        for chunk in current_level.chunks(2) {
            let combined = if chunk.len() == 2 {
                let mut data = Vec::with_capacity(64);
                data.extend_from_slice(&chunk[0]);
                data.extend_from_slice(&chunk[1]);
                hash_bytes(&data)
            } else {
                let mut data = Vec::with_capacity(64);
                data.extend_from_slice(&chunk[0]);
                data.extend_from_slice(&chunk[0]);
                hash_bytes(&data)
            };
            next_level.push(combined);
        }

        current_level = next_level;
    }

    current_level[0]
}

pub fn address_to_hex(address: &Address) -> String {
    format!("0x{}", hex::encode(address))
}

pub fn hash_to_hex(hash: &Hash) -> String {
    format!("0x{}", hex::encode(hash))
}

pub fn hex_to_address(hex_str: &str) -> Result<Address, CryptoError> {
    let clean = hex_str.strip_prefix("0x").unwrap_or(hex_str);
    let bytes = hex::decode(clean).map_err(|_| CryptoError::InvalidPublicKey)?;
    if bytes.len() != 20 {
        return Err(CryptoError::InvalidPublicKey);
    }
    let mut address = [0u8; 20];
    address.copy_from_slice(&bytes);
    Ok(address)
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_keypair_generation() {
        let keypair = Keypair::generate();
        let address = keypair.address();
        assert_eq!(address.len(), 20);
    }

    #[test]
    fn test_sign_and_verify() {
        let keypair = Keypair::generate();
        let message = b"Hello, Orbit Chain!";
        let signature = keypair.sign(message);

        assert!(verify_signature(&keypair.public_key(), message, &signature).is_ok());
    }

    #[test]
    fn test_merkle_root() {
        let hashes = vec![
            hash_bytes(b"tx1"),
            hash_bytes(b"tx2"),
            hash_bytes(b"tx3"),
            hash_bytes(b"tx4"),
        ];
        let root = compute_merkle_root(&hashes);
        assert_ne!(root, [0u8; 32]);
    }
}
