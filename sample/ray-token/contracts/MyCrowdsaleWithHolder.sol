pragma solidity 0.5.0;

/**
 * Copyright (c) 2018 Blockchain GmbH
 * Released under the MIT License
 * https://github.com/FractalBlockchain/erc725/blob/da773ab415e317b37eee480d1184dd6efe1b97e0/LICENSE
 * Original Code
 * https://github.com/FractalBlockchain/erc725/blob/da773ab415e317b37eee480d1184dd6efe1b97e0/contracts/VeryGoodCrowdsale.sol
 * modified by Kang SangHun
 */

import "openzeppelin-solidity/contracts/crowdsale/Crowdsale.sol";
import "openzeppelin-solidity/contracts/crowdsale/emission/MintedCrowdsale.sol";
import "openzeppelin-solidity/contracts/token/ERC20/ERC20Mintable.sol";
import './identity/ClaimHolder.sol';


contract MyCrowdsaleWithHolder is Crowdsale, MintedCrowdsale {

    ClaimHolder public trustedClaimHolder;

    constructor(uint256 rate, address payable wallet, ERC20 token, address _trustedClaimHolder)
    MintedCrowdsale()
    Crowdsale(rate, wallet, token)
    public{
        trustedClaimHolder = ClaimHolder(_trustedClaimHolder);
    }

    function _preValidatePurchase(
        address _beneficiary,
        uint256 _weiAmount
    )
    internal view
    {
        require(_beneficiary != address(0));
        require(_weiAmount != 0);

        ClaimHolder beneficiaryIdentity = ClaimHolder(_beneficiary);
        require(checkClaim(beneficiaryIdentity, 7));
    }

    function checkClaim(ClaimHolder _identity, uint256 claimType)
    public view
    returns (bool claimValid)
    {
        if (claimIsValid(_identity, claimType)) {
            return true;
        } else {
            return false;
        }
    }

    function claimIsValid(ClaimHolder _identity, uint256 claimType)
    public view
    returns (bool claimValid)
    {
        uint256 foundClaimType;
        uint256 scheme;
        address issuer;
        bytes memory sig;
        bytes memory data;

        // Construct claimId (identifier + claim type)
        bytes32 claimId = keccak256(abi.encodePacked(trustedClaimHolder, claimType));

        // Fetch claim from user
        (foundClaimType, scheme, issuer, sig, data,) = _identity.getClaim(claimId);

        bytes32 dataHash = keccak256(abi.encodePacked(_identity, claimType, data));
        bytes32 prefixedHash = keccak256(abi.encodePacked("\x19Ethereum Signed Message:\n32", dataHash));

        // Recover address of data signer
        address recovered = getRecoveredAddress(sig, prefixedHash);

        // Take hash of recovered address
        bytes32 hashedAddr = keccak256(abi.encodePacked(recovered));

        // Does the trusted identifier have they key which signed the user's claim?
        return trustedClaimHolder.keyHasPurpose(hashedAddr, 3);
    }

    function getRecoveredAddress(bytes memory sig, bytes32 dataHash)
    public pure
    returns (address addr)
    {
        bytes32 ra;
        bytes32 sa;
        uint8 va;

        // Check the signature length
        if (sig.length != 65) {
            return address(0);
        }

        // Divide the signature in r, s and v variables
        assembly {
            ra := mload(add(sig, 32))
            sa := mload(add(sig, 64))
            va := byte(0, mload(add(sig, 96)))
        }

        if (va < 27) {
            va += 27;
        }

        address recoveredAddress = ecrecover(dataHash, va, ra, sa);

        return (recoveredAddress);
    }
}