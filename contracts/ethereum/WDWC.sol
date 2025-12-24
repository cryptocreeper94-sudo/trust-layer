// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title Wrapped DarkWave Coin (wDWC)
 * @notice ERC-20 representation of DWC bridged from DarkWave Smart Chain (DSC)
 * @dev Minting is controlled by the bridge operator (Founders Validator)
 * 
 * Bridge Flow:
 * 1. User locks DWC on DarkWave Smart Chain
 * 2. Bridge operator calls mint() to create wDWC on Ethereum
 * 3. User can transfer wDWC freely on Ethereum
 * 4. To bridge back: user calls burn(), operator releases DWC on DSC
 */
contract WDWC is ERC20, ERC20Burnable, Ownable {
    event BridgeMint(address indexed to, uint256 amount, bytes32 indexed lockId);
    event BridgeBurn(address indexed from, uint256 amount, string dscAddress);
    
    mapping(bytes32 => bool) public processedLocks;
    
    constructor(address bridgeOperator) ERC20("Wrapped DarkWave Coin", "wDWC") Ownable(bridgeOperator) {}
    
    /**
     * @notice Mint wDWC after DWC is locked on DarkWave Smart Chain
     * @param to Recipient address on Ethereum
     * @param amount Amount to mint (18 decimals, matches DWC)
     * @param lockId Unique lock ID from DSC to prevent double-minting
     */
    function mint(address to, uint256 amount, bytes32 lockId) external onlyOwner {
        require(!processedLocks[lockId], "Lock already processed");
        processedLocks[lockId] = true;
        _mint(to, amount);
        emit BridgeMint(to, amount, lockId);
    }
    
    /**
     * @notice Burn wDWC to release DWC on DarkWave Smart Chain
     * @param amount Amount to burn
     * @param dscAddress Recipient address on DSC
     */
    function bridgeBurn(uint256 amount, string calldata dscAddress) external {
        require(bytes(dscAddress).length > 0, "Invalid DSC address");
        _burn(msg.sender, amount);
        emit BridgeBurn(msg.sender, amount, dscAddress);
    }
    
    /**
     * @notice Check if a lock ID has been processed
     * @param lockId The lock ID to check
     */
    function isLockProcessed(bytes32 lockId) external view returns (bool) {
        return processedLocks[lockId];
    }
    
    /**
     * @notice Transfer bridge operator role
     * @param newOperator New bridge operator address
     */
    function transferBridgeOperator(address newOperator) external onlyOwner {
        transferOwnership(newOperator);
    }
}
