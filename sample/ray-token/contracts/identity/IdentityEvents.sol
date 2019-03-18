pragma solidity 0.5.0;

/**
 * Copyright (c) 2018 Origin Protocol Inc
 * Released under the MIT License
 * https://github.com/OriginProtocol/origin/blob/159cc75b93103b4564a5728c47a150c0e734a004/LICENSE
 * Original Code
 * https://github.com/OriginProtocol/origin/blob/159cc75b93103b4564a5728c47a150c0e734a004/origin-contracts/contracts/identity/IdentityEvents.sol
 * modified by Kang SangHun
 */

//
// A contract to emit events to track changes of users identity data stored in IPFS.
//

contract IdentityEvents {
    event IdentityUpdated(address indexed account, bytes32 ipfsHash);
    event IdentityDeleted(address indexed account);

    // @param ipfsHash IPFS hash of the updated identity.
    function emitIdentityUpdated(bytes32 ipfsHash) public {
        emit IdentityUpdated(msg.sender, ipfsHash);
    }

    function emitIdentityDeleted() public {
        emit IdentityDeleted(msg.sender);
    }
}