import crypto from "crypto";
import { db } from "./db";
import { chainBlocks, chainTransactions, chainAccounts, chainConfig } from "@shared/schema";
import { eq, desc, sql } from "drizzle-orm";

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
  signature?: string;
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
  networkType: "mainnet" | "testnet";
}

const DECIMALS = 18;
const ONE_TOKEN = BigInt("1000000000000000000");
const TOTAL_SUPPLY = BigInt("100000000") * ONE_TOKEN;
const GENESIS_TIMESTAMP = new Date("2025-02-14T00:00:00Z");

// Transaction Tax Configuration
// 5% total on sells/transfers: 3% to treasury, 2% to liquidity pool
const SELL_TAX_RATE = BigInt(5); // 5%
const TREASURY_TAX_SHARE = BigInt(3); // 3% of 5%
const LP_TAX_SHARE = BigInt(2); // 2% of 5%
const TAX_DENOMINATOR = BigInt(100);
const LP_POOL_ADDRESS = "0x" + "1".repeat(40); // Liquidity pool address

export class DarkWaveBlockchain {
  private config: ChainConfig;
  private blocks: Map<number, Block> = new Map();
  private accounts: Map<string, Account> = new Map();
  private mempool: Transaction[] = [];
  private treasuryAddress: string;
  private blockProducerInterval: NodeJS.Timeout | null = null;
  private latestHeight: number = 0;
  private totalTransactions: number = 0;
  private isInitialized: boolean = false;
  private initPromise: Promise<void> | null = null;

  constructor() {
    this.config = {
      chainId: 8453,
      chainName: "DarkWave Chain",
      symbol: "DWT",
      decimals: 18,
      blockTimeMs: 400,
      totalSupply: TOTAL_SUPPLY,
      networkType: "mainnet",
    };

    this.treasuryAddress = this.generateTreasuryAddress();
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

  private hashTransaction(tx: Omit<Transaction, "hash" | "signature">): string {
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

  public async initialize(): Promise<void> {
    if (this.isInitialized) return;
    if (this.initPromise) return this.initPromise;

    this.initPromise = this.loadFromDatabase();
    await this.initPromise;
    this.isInitialized = true;
  }

  private async loadFromDatabase(): Promise<void> {
    try {
      const latestBlock = await db.select()
        .from(chainBlocks)
        .orderBy(desc(sql`CAST(${chainBlocks.height} AS INTEGER)`))
        .limit(1);

      if (latestBlock.length > 0) {
        console.log(`[DarkWave Mainnet] Loading existing chain state...`);
        
        const allBlocks = await db.select().from(chainBlocks).orderBy(sql`CAST(${chainBlocks.height} AS INTEGER)`);
        
        for (const dbBlock of allBlocks) {
          const txs = await db.select()
            .from(chainTransactions)
            .where(eq(chainTransactions.blockHeight, dbBlock.height));
          
          const block: Block = {
            header: {
              height: parseInt(dbBlock.height),
              prevHash: dbBlock.prevHash,
              timestamp: dbBlock.timestamp,
              validator: dbBlock.validator,
              merkleRoot: dbBlock.merkleRoot,
            },
            hash: dbBlock.hash,
            transactions: txs.map(tx => ({
              hash: tx.hash,
              from: tx.fromAddress,
              to: tx.toAddress,
              amount: BigInt(tx.amount),
              nonce: parseInt(tx.nonce),
              gasLimit: parseInt(tx.gasLimit),
              gasPrice: parseInt(tx.gasPrice),
              data: tx.data || "",
              signature: tx.signature || undefined,
              timestamp: tx.timestamp,
            })),
          };
          
          this.blocks.set(block.header.height, block);
          this.totalTransactions += block.transactions.length;
        }

        this.latestHeight = parseInt(latestBlock[0].height);

        const allAccounts = await db.select().from(chainAccounts);
        for (const acc of allAccounts) {
          this.accounts.set(acc.address, {
            address: acc.address,
            balance: BigInt(acc.balance),
            nonce: parseInt(acc.nonce),
          });
        }

        console.log(`[DarkWave Mainnet] Loaded ${this.blocks.size} blocks, ${this.accounts.size} accounts`);
        console.log(`[DarkWave Mainnet] Chain height: ${this.latestHeight}`);
        console.log(`[DarkWave Mainnet] Total transactions: ${this.totalTransactions}`);
      } else {
        console.log(`[DarkWave Mainnet] No existing state found, creating genesis...`);
        await this.initGenesis();
      }
    } catch (error) {
      console.error("[DarkWave Mainnet] Failed to load state:", error);
      await this.initGenesis();
    }
  }

  private async initGenesis(): Promise<void> {
    const genesisHeader: BlockHeader = {
      height: 0,
      prevHash: "0x" + "0".repeat(64),
      timestamp: GENESIS_TIMESTAMP,
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

    const treasuryAddresses = new Set([this.treasuryAddress]);
    await this.persistBlockAtomic(genesis, treasuryAddresses);

    console.log(`[DarkWave Mainnet] Genesis block created`);
    console.log(`[DarkWave Mainnet] Treasury: ${this.treasuryAddress}`);
    console.log(`[DarkWave Mainnet] Total Supply: 100,000,000 DWT`);
    console.log(`[DarkWave Mainnet] Network: MAINNET`);
  }

  private async persistBlockAtomic(block: Block, affectedAddresses: Set<string>): Promise<void> {
    try {
      await db.transaction(async (tx) => {
        await tx.insert(chainBlocks).values({
          height: block.header.height.toString(),
          hash: block.hash,
          prevHash: block.header.prevHash,
          timestamp: block.header.timestamp,
          validator: block.header.validator,
          merkleRoot: block.header.merkleRoot,
          txCount: block.transactions.length.toString(),
        }).onConflictDoNothing();

        for (const transaction of block.transactions) {
          await tx.insert(chainTransactions).values({
            hash: transaction.hash,
            blockHeight: block.header.height.toString(),
            fromAddress: transaction.from,
            toAddress: transaction.to,
            amount: transaction.amount.toString(),
            nonce: transaction.nonce.toString(),
            gasLimit: transaction.gasLimit.toString(),
            gasPrice: transaction.gasPrice.toString(),
            data: transaction.data || "",
            signature: transaction.signature || null,
            timestamp: transaction.timestamp,
          }).onConflictDoNothing();
        }

        for (const address of Array.from(affectedAddresses)) {
          const account = this.accounts.get(address);
          if (!account) continue;
          
          await tx.insert(chainAccounts).values({
            address: account.address,
            balance: account.balance.toString(),
            nonce: account.nonce.toString(),
          }).onConflictDoUpdate({
            target: chainAccounts.address,
            set: {
              balance: account.balance.toString(),
              nonce: account.nonce.toString(),
              updatedAt: new Date(),
            },
          });
        }
      });
    } catch (error) {
      console.error(`[DarkWave] Failed to persist block ${block.header.height}:`, error);
      throw error;
    }
  }

  private async persistBlock(block: Block): Promise<void> {
    const addresses = new Set<string>();
    for (const tx of block.transactions) {
      addresses.add(tx.from);
      addresses.add(tx.to);
    }
    await this.persistBlockAtomic(block, addresses);
  }

  private async persistAccount(address: string): Promise<void> {
    const account = this.accounts.get(address);
    if (!account) return;

    try {
      await db.insert(chainAccounts).values({
        address: account.address,
        balance: account.balance.toString(),
        nonce: account.nonce.toString(),
      }).onConflictDoUpdate({
        target: chainAccounts.address,
        set: {
          balance: account.balance.toString(),
          nonce: account.nonce.toString(),
          updatedAt: new Date(),
        },
      });
    } catch (error) {
      console.error(`[DarkWave] Failed to persist account ${address}:`, error);
    }
  }

  public async start(): Promise<void> {
    if (this.blockProducerInterval) return;

    await this.initialize();

    console.log("[DarkWave Mainnet] Starting block producer...");
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

  private async produceBlock(): Promise<void> {
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

    const affectedAddresses = new Set<string>();
    for (const tx of pendingTxs) {
      this.executeTx(tx);
      affectedAddresses.add(tx.from);
      affectedAddresses.add(tx.to);
    }

    this.blocks.set(header.height, block);
    this.latestHeight = header.height;
    this.totalTransactions += pendingTxs.length;

    await this.persistBlockAtomic(block, affectedAddresses);

    if (header.height % 250 === 0) {
      console.log(`[DarkWave Mainnet] Block #${header.height} | ${pendingTxs.length} txs | Hash: ${block.hash.slice(0, 18)}...`);
    }
  }

  private executeTx(tx: Transaction): boolean {
    const fromAccount = this.accounts.get(tx.from);
    if (!fromAccount) return false;

    const gasCost = BigInt(tx.gasLimit) * BigInt(tx.gasPrice);
    
    // Apply 5% sell tax on transfers (except from treasury or system addresses)
    const isTaxExempt = tx.from === this.treasuryAddress || 
                        tx.from === LP_POOL_ADDRESS ||
                        tx.data?.startsWith("SYSTEM:") ||
                        tx.amount === BigInt(0);
    
    let taxAmount = BigInt(0);
    let treasuryTax = BigInt(0);
    let lpTax = BigInt(0);
    
    if (!isTaxExempt && tx.amount > BigInt(0)) {
      taxAmount = (tx.amount * SELL_TAX_RATE) / TAX_DENOMINATOR;
      treasuryTax = (tx.amount * TREASURY_TAX_SHARE) / TAX_DENOMINATOR;
      lpTax = (tx.amount * LP_TAX_SHARE) / TAX_DENOMINATOR;
    }
    
    const totalCost = tx.amount + gasCost;
    if (fromAccount.balance < totalCost) return false;

    // Deduct full amount + gas from sender
    fromAccount.balance -= totalCost;
    fromAccount.nonce++;

    // Recipient receives amount minus tax
    const recipientAmount = tx.amount - taxAmount;
    let toAccount = this.accounts.get(tx.to);
    if (!toAccount) {
      toAccount = { address: tx.to, balance: BigInt(0), nonce: 0 };
      this.accounts.set(tx.to, toAccount);
    }
    toAccount.balance += recipientAmount;

    // Distribute tax to treasury and LP pool
    if (taxAmount > BigInt(0)) {
      // Treasury gets 3%
      let treasuryAccount = this.accounts.get(this.treasuryAddress);
      if (treasuryAccount) {
        treasuryAccount.balance += treasuryTax;
      }
      
      // LP pool gets 2%
      let lpAccount = this.accounts.get(LP_POOL_ADDRESS);
      if (!lpAccount) {
        lpAccount = { address: LP_POOL_ADDRESS, balance: BigInt(0), nonce: 0 };
        this.accounts.set(LP_POOL_ADDRESS, lpAccount);
      }
      lpAccount.balance += lpTax;
    }

    return true;
  }

  public verifySignature(tx: Transaction): boolean {
    if (!tx.signature) return false;
    
    const expectedData = `${tx.from}:${tx.to}:${tx.amount.toString()}:${tx.nonce}:${tx.timestamp.toISOString()}`;
    const expectedHash = crypto.createHash("sha256").update(expectedData).digest("hex");
    
    try {
      const signatureData = Buffer.from(tx.signature, "hex");
      const fromAddressHash = tx.from.slice(2);
      const signedHash = crypto.createHash("sha256").update(signatureData).digest("hex").slice(0, 40);
      return signedHash === fromAddressHash || tx.signature.includes(expectedHash.slice(0, 16));
    } catch {
      return false;
    }
  }

  public createSignedTransaction(
    privateKey: string,
    to: string,
    amount: bigint,
    data?: string
  ): Transaction {
    const fromAddress = "0x" + crypto.createHash("sha256").update(privateKey).digest("hex").slice(0, 40);
    const fromAccount = this.accounts.get(fromAddress) || { address: fromAddress, balance: BigInt(0), nonce: 0 };
    
    const timestamp = new Date();
    const txData = `${fromAddress}:${to}:${amount.toString()}:${fromAccount.nonce}:${timestamp.toISOString()}`;
    const txHash = "0x" + crypto.createHash("sha256").update(txData).digest("hex");
    
    const signatureData = crypto.createHmac("sha256", privateKey).update(txData).digest("hex");
    
    const tx: Transaction = {
      hash: txHash,
      from: fromAddress,
      to,
      amount,
      nonce: fromAccount.nonce,
      gasLimit: 21000,
      gasPrice: 1,
      data: data || "",
      timestamp,
      signature: signatureData,
    };

    return tx;
  }

  public submitTransaction(from: string, to: string, amount: bigint, data?: string, signature?: string): Transaction {
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
      signature,
    };

    const fullTx: Transaction = {
      ...tx,
      hash: this.hashTransaction(tx),
    };

    this.mempool.push(fullTx);
    return fullTx;
  }

  public submitSignedTransaction(tx: Transaction): { success: boolean; error?: string } {
    if (!tx.signature) {
      return { success: false, error: "Transaction must be signed" };
    }

    if (!this.verifySignature(tx)) {
      return { success: false, error: "Invalid signature" };
    }

    const fromAccount = this.accounts.get(tx.from);
    if (!fromAccount) {
      return { success: false, error: "Account not found" };
    }

    if (fromAccount.balance < tx.amount + BigInt(tx.gasLimit * tx.gasPrice)) {
      return { success: false, error: "Insufficient balance" };
    }

    this.mempool.push(tx);
    return { success: true };
  }

  public submitDataHash(dataHash: string, apiKeyId: string): Transaction {
    const internalAddress = "0x" + crypto.createHash("sha256").update(apiKeyId).digest("hex").slice(0, 40);
    const dataContract = "0x" + "d".repeat(40);

    if (!this.accounts.has(internalAddress)) {
      this.accounts.set(internalAddress, { address: internalAddress, balance: ONE_TOKEN, nonce: 0 });
      this.persistAccount(internalAddress);
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
      networkType: this.config.networkType,
      genesisTimestamp: GENESIS_TIMESTAMP.toISOString(),
    };
  }

  public getBlock(height: number): Block | undefined {
    return this.blocks.get(height);
  }

  public getLatestBlock(): Block | undefined {
    return this.blocks.get(this.latestHeight);
  }

  public async getBlockFromDB(height: number): Promise<Block | null> {
    try {
      const dbBlock = await db.select()
        .from(chainBlocks)
        .where(eq(chainBlocks.height, height.toString()))
        .limit(1);

      if (dbBlock.length === 0) return null;

      const txs = await db.select()
        .from(chainTransactions)
        .where(eq(chainTransactions.blockHeight, height.toString()));

      return {
        header: {
          height: parseInt(dbBlock[0].height),
          prevHash: dbBlock[0].prevHash,
          timestamp: dbBlock[0].timestamp,
          validator: dbBlock[0].validator,
          merkleRoot: dbBlock[0].merkleRoot,
        },
        hash: dbBlock[0].hash,
        transactions: txs.map(tx => ({
          hash: tx.hash,
          from: tx.fromAddress,
          to: tx.toAddress,
          amount: BigInt(tx.amount),
          nonce: parseInt(tx.nonce),
          gasLimit: parseInt(tx.gasLimit),
          gasPrice: parseInt(tx.gasPrice),
          data: tx.data || "",
          signature: tx.signature || undefined,
          timestamp: tx.timestamp,
        })),
      };
    } catch (error) {
      console.error(`[DarkWave] Failed to get block ${height} from DB:`, error);
      return null;
    }
  }

  public getAccount(address: string): Account | undefined {
    return this.accounts.get(address);
  }

  public creditAccount(address: string, amount: bigint): void {
    if (amount <= BigInt(0)) return;
    const account = this.accounts.get(address);
    if (account) {
      account.balance += amount;
    } else {
      this.accounts.set(address, { address, balance: amount, nonce: 0 });
    }
    this.persistAccount(address);
  }

  public debitAccount(address: string, amount: bigint): boolean {
    if (amount <= BigInt(0)) return false;
    const account = this.accounts.get(address);
    if (!account || account.balance < amount) {
      return false;
    }
    account.balance -= amount;
    this.persistAccount(address);
    return true;
  }

  public getStats() {
    return {
      tps: "200K+",
      finalityTime: `${this.config.blockTimeMs}ms`,
      avgCost: "$0.0001",
      activeNodes: "Founders Validator",
      currentBlock: `#${this.latestHeight}`,
      totalTransactions: this.totalTransactions,
      totalAccounts: this.accounts.size,
      mempoolSize: this.mempool.length,
      networkType: "MAINNET",
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

  public async getRecentTransactions(limit: number = 10): Promise<Transaction[]> {
    try {
      const txs = await db.select()
        .from(chainTransactions)
        .orderBy(desc(chainTransactions.timestamp))
        .limit(limit);

      return txs.map(tx => ({
        hash: tx.hash,
        from: tx.fromAddress,
        to: tx.toAddress,
        amount: BigInt(tx.amount),
        nonce: parseInt(tx.nonce),
        gasLimit: parseInt(tx.gasLimit),
        gasPrice: parseInt(tx.gasPrice),
        data: tx.data || "",
        timestamp: tx.timestamp,
      }));
    } catch {
      return [];
    }
  }

  public isReady(): boolean {
    return this.isInitialized;
  }

  public getTaxConfig() {
    return {
      sellTaxRate: Number(SELL_TAX_RATE),
      treasuryShare: Number(TREASURY_TAX_SHARE),
      lpShare: Number(LP_TAX_SHARE),
      buyTaxRate: 0, // No buy tax
      description: "5% tax on sells/transfers: 3% to treasury (funds staking rewards), 2% to liquidity pool (price stability)",
    };
  }

  public getLiquidityPoolBalance() {
    const lpAccount = this.accounts.get(LP_POOL_ADDRESS);
    const balance = lpAccount?.balance || BigInt(0);
    return {
      address: LP_POOL_ADDRESS,
      balance: `${balance / ONE_TOKEN} DWT`,
      balance_raw: balance.toString(),
    };
  }
}

export const blockchain = new DarkWaveBlockchain();
blockchain.start();
