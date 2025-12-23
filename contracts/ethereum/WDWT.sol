// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title Wrapped DarkWave Token (wDWT)
 * @notice ERC-20 representation of DWT bridged from DarkWave Chain
 * @dev Minting is controlled by the bridge operator (Founders Validator)
 * 
 * Bridge Flow:
 * 1. User locks DWT on DarkWave Chain
 * 2. Bridge operator calls mint() to create wDWT on Ethereum
 * 3. User can transfer wDWT freely on Ethereum
 * 4. To bridge back: user calls burn(), operator releases DWT on DarkWave Chain
 */
contract WDWT is ERC20, ERC20Burnable, Ownable {
    event BridgeMint(address indexed to, uint256 amount, bytes32 indexed lockId);
    event BridgeBurn(address indexed from, uint256 amount, string darkwaveAddress);
    
    mapping(bytes32 => bool) public processedLocks;
    
    constructor(address bridgeOperator) ERC20("Wrapped DarkWave Token", "wDWT") Ownable(bridgeOperator) {}
    
    /**
     * @notice Mint wDWT after DWT is locked on DarkWave Chain
     * @param to Recipient address on Ethereum
     * @param amount Amount to mint (18 decimals, matches DWT)
     * @param lockId Unique lock ID from DarkWave Chain to prevent double-minting
     */
    function mint(address to, uint256 amount, bytes32 lockId) external onlyOwner {
        require(!processedLocks[lockId], "Lock already processed");
        processedLocks[lockId] = true;
        _mint(to, amount);
        emit BridgeMint(to, amount, lockId);
    }
    
    /**
     * @notice Burn wDWT to release DWT on DarkWave Chain
     * @param amount Amount to burn
     * @param darkwaveAddress Recipient address on DarkWave Chain
     */
    function bridgeBurn(uint256 amount, string calldata darkwaveAddress) external {
        require(bytes(darkwaveAddress).length > 0, "Invalid DarkWave address");
        _burn(msg.sender, amount);
        emit BridgeBurn(msg.sender, amount, darkwaveAddress);
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
