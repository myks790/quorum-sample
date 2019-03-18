pragma solidity 0.5.0;

/**
 * Copyright (c) 2018 Origin Protocol Inc
 * Released under the MIT License
 * https://github.com/OriginProtocol/origin/blob/159cc75b93103b4564a5728c47a150c0e734a004/LICENSE
 * Original Code
 * https://github.com/OriginProtocol/origin/blob/159cc75b93103b4564a5728c47a150c0e734a004/origin-contracts/contracts/identity/ClaimHolderRegistered.sol
 * modified by Kang SangHun
 */

import "./ClaimHolder.sol";
import "./V00_UserRegistry.sol";


contract ClaimHolderRegistered is ClaimHolder {

    constructor (
        address _userRegistryAddress
    )
        public
    {
        V00_UserRegistry userRegistry = V00_UserRegistry(_userRegistryAddress);
        userRegistry.registerUser();
    }
}
