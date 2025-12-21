# DarkWave Token (DWT) - Agent Handoff Document

## IMPORTANT: Token Implementation Location Changed

The DarkWave Token (DWT) is now implemented as the **native token** of the DarkWave Chain Layer 1 blockchain, NOT as a separate ERC-20 smart contract.

---

## What This Means

1. **No separate smart contract deployment needed** - DWT is built directly into the blockchain
2. **No need to deploy to Ethereum, Polygon, or any other chain** - DarkWave Chain is its own independent blockchain
3. **The DWT token contract specification at orbitstaffing.io is now reference documentation** - The actual token lives on DarkWave Chain

---

## Final DWT Token Specifications

| Property | Value |
|----------|-------|
| **Token Name** | DarkWave Token |
| **Symbol** | DWT |
| **Total Supply** | 100,000,000 DWT |
| **Decimals** | 18 |
| **Network** | DarkWave Chain (Layer 1) |
| **Chain ID** | 8453 |
| **Block Time** | 400ms |
| **Consensus** | Proof-of-Authority |

---

## Token Location

The 100 million DWT tokens are minted at blockchain genesis to the validator address. This is the "treasury" that can then distribute tokens to:
- Ecosystem grants and partnerships
- Community rewards and airdrops  
- Team allocations (with vesting)
- DAO treasury
- Liquidity pools

---

## Blockchain RPC Endpoints

The DarkWave Chain blockchain exposes these APIs:

```
GET  /chain           - Chain info (ID, name, height, symbol)
GET  /block/:height   - Get block by height
GET  /block/latest    - Get latest block
GET  /account/:addr   - Get account balance/nonce
POST /transaction     - Submit transaction
GET  /stats           - Network statistics
```

---

## What Still Needs to Be Built

1. **Wallet Integration** - Web wallet to send/receive DWT
2. **Block Explorer** - Visual interface for the web portal
3. **Multi-Node Network** - P2P networking for decentralization
4. **Staking System** - Implement the staking rewards (6%/9%/12% APY)
5. **Governance** - Voting system (1 DWT = 1 vote)

---

## Summary

**DO NOT** deploy a separate ERC-20 contract for DWT.

The DarkWave Token is now the native currency of the DarkWave Chain blockchain, similar to how:
- ETH is native to Ethereum
- SOL is native to Solana
- MATIC is native to Polygon

All DWT operations happen directly on DarkWave Chain.

---

*Generated: December 2024*
*Project: DarkWave Studios - DarkWave Chain*
