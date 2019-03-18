pragma solidity 0.5.0;

/**
 * Copyright (c) 2018 Origin Protocol Inc
 * Released under the MIT License
 * https://github.com/OriginProtocol/origin/blob/159cc75b93103b4564a5728c47a150c0e734a004/LICENSE
 * Original Code
 * https://github.com/OriginProtocol/origin/blob/159cc75b93103b4564a5728c47a150c0e734a004/origin-contracts/contracts/identity/ClaimHolder.sol
 * modified by Kang SangHun
 */

import "./ERC735.sol";
import "./KeyHolder.sol";
import "./ClaimHolderLibrary.sol";


contract ClaimHolder is KeyHolder, ERC735 {

    ClaimHolderLibrary.Claims claims;

    function addClaim(
        uint256 _topic,
        uint256 _scheme,
        address _issuer,
        bytes memory _signature,
        bytes memory _data,
        string memory _uri
    )
        public
        returns (bytes32 claimRequestId)
    {
        return ClaimHolderLibrary.addClaim(
            keyHolderData,
            claims,
            _topic,
            _scheme,
            _issuer,
            _signature,
            _data,
            _uri
        );
    }

    function addClaims(
        uint256[] memory _topic,
        address[] memory _issuer,
        bytes memory _signature,
        bytes memory _data,
        uint256[] memory _offsets
    )
        public
    {
        ClaimHolderLibrary.addClaims(
            keyHolderData,
            claims,
            _topic,
            _issuer,
            _signature,
            _data,
            _offsets
        );
    }

    function removeClaim(bytes32 _claimId) public returns (bool success) {
        return ClaimHolderLibrary.removeClaim(keyHolderData, claims, _claimId);
    }

    function getClaim(bytes32 _claimId)
        public
        view
        returns(
            uint256 topic,
            uint256 scheme,
            address issuer,
            bytes memory signature,
            bytes memory data,
            string memory uri
        )
    {
        return ClaimHolderLibrary.getClaim(claims, _claimId);
    }

    function getClaimIdsByTopic(uint256 _topic)
        public
        view
        returns(bytes32[] memory claimIds)
    {
        return claims.byTopic[_topic];
    }
}
