# wDWT SPL Token (Solana)

Wrapped DarkWave Token on Solana - SPL Token representation of DWT bridged from DarkWave Chain.

## Token Details

| Property | Value |
|----------|-------|
| Name | Wrapped DarkWave Token |
| Symbol | wDWT |
| Decimals | 9 (Solana standard) |
| Network | Solana Devnet (testnet phase) |

## Deployment Steps

### Prerequisites

1. Install Solana CLI: https://docs.solana.com/cli/install-solana-cli-tools
2. Install SPL Token CLI: `cargo install spl-token-cli`
3. Fund your wallet with Devnet SOL: `solana airdrop 2`

### Create Token Mint

```bash
# Set to Devnet
solana config set --url devnet

# Create the wDWT token mint (save the address!)
spl-token create-token --decimals 9

# Create token account for bridge operator
spl-token create-account <MINT_ADDRESS>

# Mint initial supply (if needed for testing)
spl-token mint <MINT_ADDRESS> 1000000
```

### After Deployment

1. Save the mint address
2. Set `WDWT_SOLANA_ADDRESS` environment variable in Replit
3. The bridge will automatically use real minting

## Bridge Flow

```
DarkWave Chain                    Solana Devnet
     |                                  |
     | 1. User locks DWT                |
     |--------------------------------->|
     |                                  |
     | 2. Bridge operator mints wDWT    |
     |                                  |
     |<---------------------------------|
     | 3. User burns wDWT               |
     |                                  |
     | 4. Bridge releases DWT           |
     |--------------------------------->|
```

## Mint Authority

The bridge operator (Founders Validator) holds the mint authority. Only this wallet can mint new wDWT tokens when DWT is locked on DarkWave Chain.
