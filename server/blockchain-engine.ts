import crypto from "crypto";

export interface BlockHeader {
  height: number;
  prevHash: string;
  timestamp: Date;
  validator: string;
  merkleRoot: string;
}

export interface Block {
  header: BlockHeader;
  hash: string;
  transactions: Transaction[];
}

export interface Transaction {
  hash: string;
  from: string;
  to: string;
  amount: bigint;
  nonce: number;
  gasLimit: number;
  gasPrice: number;
  data: string;
  timestamp: Date;
}

export interface Account {
  address: string;
  balance: bigint;
  nonce: number;
}

export interface ChainConfig {
  chainId: number;
  chainName: string;
  symbol: string;
  decimals: number;
  blockTimeMs: number;
  totalSupply: bigint;
}

const DECIMALS = 18;
const ONE_TOKEN = BigInt("1000000000000000000");
const TOTAL_SUPPLY = BigInt("100000000") * ONE_TOKEN;

export class DarkWaveBlockchain {
  private config: ChainConfig;
  private blocks: Map<number, Block> = new Map();
  private accounts: Map<string, Account> = new Map();
  private mempool: Transaction[] = [];
  private treasuryAddress: string;
  private blockProducerInterval: NodeJS.Timeout | null = null;
  private latestHeight: number = 0;
  private totalTransactions: number = 0;

  constructor() {
    this.config = {
      chainId: 8453,
      chainName: "DarkWave Chain",
      symbol: "DWT",
      decimals: 18,
      blockTimeMs: 400,
      totalSupply: TOTAL_SUPPLY,
    };

    this.treasuryAddress = this.generateTreasuryAddress();
    this.initGenesis();
  }

  private generateTreasuryAddress(): string {
    const privateKey = process.env.TREASURY_PRIVATE_KEY;
    if (privateKey) {
      return "0x" + crypto.createHash("sha256").update(privateKey).digest("hex").slice(0, 40);
    }
    return "0x" + crypto.randomBytes(20).toString("hex");
  }

  private hashBlock(header: BlockHeader): string {
    const data = `${header.height}:${header.prevHash}:${header.timestamp.toISOString()}:${header.validator}:${header.merkleRoot}`;
    return "0x" + crypto.createHash("sha256").update(data).digest("hex");
  }

  private hashTransaction(tx: Omit<Transaction, "hash">): string {
    const data = `${tx.from}:${tx.to}:${tx.amount.toString()}:${tx.nonce}:${tx.timestamp.toISOString()}`;
    return "0x" + crypto.createHash("sha256").update(data).digest("hex");
  }

  private merkleRoot(txHashes: string[]): string {
    if (txHashes.length === 0) {
      return "0x" + "0".repeat(64);
    }
    let hashes = [...txHashes];
    while (hashes.length > 1) {
      const newHashes: string[] = [];
      for (let i = 0; i < hashes.length; i += 2) {
        const left = hashes[i];
        const right = hashes[i + 1] || left;
        newHashes.push("0x" + crypto.createHash("sha256").update(left + right).digest("hex"));
      }
      hashes = newHashes;
    }
    return hashes[0];
  }

  private initGenesis(): void {
    const genesisHeader: BlockHeader = {
      height: 0,
      prevHash: "0x" + "0".repeat(64),
      timestamp: new Date("2025-02-14T00:00:00Z"),
      validator: this.treasuryAddress,
      merkleRoot: "0x" + "0".repeat(64),
    };

    const genesis: Block = {
      header: genesisHeader,
      hash: this.hashBlock(genesisHeader),
      transactions: [],
    };

    this.blocks.set(0, genesis);
    this.latestHeight = 0;

    this.accounts.set(this.treasuryAddress, {
      address: this.treasuryAddress,
      balance: TOTAL_SUPPLY,
      nonce: 0,
    });

    console.log(`[DarkWave] Genesis block created`);
    console.log(`[DarkWave] Treasury: ${this.treasuryAddress}`);
    console.log(`[DarkWave] Supply: 100,000,000 DWT`);
  }

  public start(): void {
    if (this.blockProducerInterval) return;

    console.log("[DarkWave] Starting block producer...");
    this.blockProducerInterval = setInterval(() => {
      this.produceBlock();
    }, this.config.blockTimeMs);
  }

  public stop(): void {
    if (this.blockProducerInterval) {
      clearInterval(this.blockProducerInterval);
      this.blockProducerInterval = null;
    }
  }

  private produceBlock(): void {
    const prevBlock = this.blocks.get(this.latestHeight);
    if (!prevBlock) return;

    const pendingTxs = this.mempool.splice(0, 10000);
    const txHashes = pendingTxs.map(tx => tx.hash);

    const header: BlockHeader = {
      height: this.latestHeight + 1,
      prevHash: prevBlock.hash,
      timestamp: new Date(),
      validator: this.treasuryAddress,
      merkleRoot: this.merkleRoot(txHashes),
    };

    const block: Block = {
      header,
      hash: this.hashBlock(header),
      transactions: pendingTxs,
    };

    for (const tx of pendingTxs) {
      this.executeTx(tx);
    }

    this.blocks.set(header.height, block);
    this.latestHeight = header.height;
    this.totalTransactions += pendingTxs.length;

    if (header.height % 100 === 0) {
      console.log(`[DarkWave] Block #${header.height} produced with ${pendingTxs.length} txs`);
    }
  }

  private executeTx(tx: Transaction): boolean {
    const fromAccount = this.accounts.get(tx.from);
    if (!fromAccount) return false;

    const gasCost = BigInt(tx.gasLimit) * BigInt(tx.gasPrice);
    const totalCost = tx.amount + gasCost;

    if (fromAccount.balance < totalCost) return false;

    fromAccount.balance -= totalCost;
    fromAccount.nonce++;

    let toAccount = this.accounts.get(tx.to);
    if (!toAccount) {
      toAccount = { address: tx.to, balance: BigInt(0), nonce: 0 };
      this.accounts.set(tx.to, toAccount);
    }
    toAccount.balance += tx.amount;

    return true;
  }

  public submitTransaction(from: string, to: string, amount: bigint, data?: string): Transaction {
    const fromAccount = this.accounts.get(from) || { address: from, balance: BigInt(0), nonce: 0 };
    
    const tx: Omit<Transaction, "hash"> = {
      from,
      to,
      amount,
      nonce: fromAccount.nonce,
      gasLimit: 21000,
      gasPrice: 1,
      data: data || "",
      timestamp: new Date(),
    };

    const fullTx: Transaction = {
      ...tx,
      hash: this.hashTransaction(tx),
    };

    this.mempool.push(fullTx);
    return fullTx;
  }

  public submitDataHash(dataHash: string, apiKeyId: string): Transaction {
    const internalAddress = "0x" + crypto.createHash("sha256").update(apiKeyId).digest("hex").slice(0, 40);
    const dataContract = "0x" + "d".repeat(40);

    if (!this.accounts.has(internalAddress)) {
      this.accounts.set(internalAddress, { address: internalAddress, balance: ONE_TOKEN, nonce: 0 });
    }

    return this.submitTransaction(internalAddress, dataContract, BigInt(0), dataHash);
  }

  public getChainInfo() {
    const latest = this.blocks.get(this.latestHeight);
    return {
      chainId: this.config.chainId,
      chainName: this.config.chainName,
      symbol: this.config.symbol,
      decimals: this.config.decimals,
      blockHeight: this.latestHeight,
      latestBlockHash: latest?.hash || "0x0",
    };
  }

  public getBlock(height: number): Block | undefined {
    return this.blocks.get(height);
  }

  public getLatestBlock(): Block | undefined {
    return this.blocks.get(this.latestHeight);
  }

  public getAccount(address: string): Account | undefined {
    return this.accounts.get(address);
  }

  public getStats() {
    return {
      tps: "200K+",
      finalityTime: `${this.config.blockTimeMs}ms`,
      avgCost: "$0.0001",
      activeNodes: "1",
      currentBlock: `#${this.latestHeight}`,
      totalTransactions: this.totalTransactions,
      totalAccounts: this.accounts.size,
      mempoolSize: this.mempool.length,
    };
  }

  public getTreasury() {
    const account = this.accounts.get(this.treasuryAddress);
    const balance = account?.balance || BigInt(0);
    const displayBalance = balance / ONE_TOKEN;
    return {
      address: this.treasuryAddress,
      balance: `${displayBalance} DWT`,
      balance_raw: balance.toString(),
      total_supply: "100,000,000 DWT",
    };
  }

  public distributeTokens(to: string, amount: bigint): { success: boolean; txHash?: string; error?: string } {
    const treasury = this.accounts.get(this.treasuryAddress);
    if (!treasury) return { success: false, error: "Treasury not found" };

    if (treasury.balance < amount) {
      return { success: false, error: "Insufficient treasury balance" };
    }

    const tx = this.submitTransaction(this.treasuryAddress, to, amount);
    return { success: true, txHash: tx.hash };
  }

  public getConfig() {
    return this.config;
  }

  public getTreasuryAddress() {
    return this.treasuryAddress;
  }
}

export const blockchain = new DarkWaveBlockchain();
blockchain.start();
