const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("WDWT", function () {
  let wdwt;
  let owner;
  let user1;
  let user2;

  beforeEach(async function () {
    [owner, user1, user2] = await ethers.getSigners();
    const WDWT = await ethers.getContractFactory("WDWT");
    wdwt = await WDWT.deploy(owner.address);
    await wdwt.waitForDeployment();
  });

  describe("Deployment", function () {
    it("Should set the correct name and symbol", async function () {
      expect(await wdwt.name()).to.equal("Wrapped DarkWave Token");
      expect(await wdwt.symbol()).to.equal("wDWT");
    });

    it("Should set the bridge operator as owner", async function () {
      expect(await wdwt.owner()).to.equal(owner.address);
    });

    it("Should have 18 decimals", async function () {
      expect(await wdwt.decimals()).to.equal(18);
    });

    it("Should start with zero total supply", async function () {
      expect(await wdwt.totalSupply()).to.equal(0);
    });
  });

  describe("Minting", function () {
    const lockId = ethers.keccak256(ethers.toUtf8Bytes("lock1"));
    const amount = ethers.parseEther("100");

    it("Should allow bridge operator to mint", async function () {
      await wdwt.mint(user1.address, amount, lockId);
      expect(await wdwt.balanceOf(user1.address)).to.equal(amount);
    });

    it("Should emit BridgeMint event", async function () {
      await expect(wdwt.mint(user1.address, amount, lockId))
        .to.emit(wdwt, "BridgeMint")
        .withArgs(user1.address, amount, lockId);
    });

    it("Should mark lock ID as processed", async function () {
      await wdwt.mint(user1.address, amount, lockId);
      expect(await wdwt.isLockProcessed(lockId)).to.equal(true);
    });

    it("Should reject duplicate lock ID", async function () {
      await wdwt.mint(user1.address, amount, lockId);
      await expect(wdwt.mint(user1.address, amount, lockId))
        .to.be.revertedWith("Lock already processed");
    });

    it("Should reject minting from non-owner", async function () {
      await expect(wdwt.connect(user1).mint(user1.address, amount, lockId))
        .to.be.revertedWithCustomError(wdwt, "OwnableUnauthorizedAccount");
    });
  });

  describe("Bridge Burning", function () {
    const lockId = ethers.keccak256(ethers.toUtf8Bytes("lock1"));
    const amount = ethers.parseEther("100");
    const darkwaveAddress = "DW1abc123def456";

    beforeEach(async function () {
      await wdwt.mint(user1.address, amount, lockId);
    });

    it("Should allow users to burn for bridge", async function () {
      const burnAmount = ethers.parseEther("50");
      await wdwt.connect(user1).bridgeBurn(burnAmount, darkwaveAddress);
      expect(await wdwt.balanceOf(user1.address)).to.equal(amount - burnAmount);
    });

    it("Should emit BridgeBurn event", async function () {
      const burnAmount = ethers.parseEther("50");
      await expect(wdwt.connect(user1).bridgeBurn(burnAmount, darkwaveAddress))
        .to.emit(wdwt, "BridgeBurn")
        .withArgs(user1.address, burnAmount, darkwaveAddress);
    });

    it("Should reject empty DarkWave address", async function () {
      const burnAmount = ethers.parseEther("50");
      await expect(wdwt.connect(user1).bridgeBurn(burnAmount, ""))
        .to.be.revertedWith("Invalid DarkWave address");
    });

    it("Should reject burning more than balance", async function () {
      const burnAmount = ethers.parseEther("200");
      await expect(wdwt.connect(user1).bridgeBurn(burnAmount, darkwaveAddress))
        .to.be.revertedWithCustomError(wdwt, "ERC20InsufficientBalance");
    });
  });

  describe("Bridge Operator Transfer", function () {
    it("Should allow owner to transfer operator role", async function () {
      await wdwt.transferBridgeOperator(user1.address);
      expect(await wdwt.owner()).to.equal(user1.address);
    });

    it("Should reject transfer from non-owner", async function () {
      await expect(wdwt.connect(user1).transferBridgeOperator(user2.address))
        .to.be.revertedWithCustomError(wdwt, "OwnableUnauthorizedAccount");
    });
  });
});
