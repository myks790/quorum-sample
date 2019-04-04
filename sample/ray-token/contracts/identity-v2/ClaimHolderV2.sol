pragma solidity 0.5.0;

import "../identity/ERC735.sol";
import "./KeyManager.sol";

contract ClaimHolderV2 is ERC735, KeyManager {


    mapping(bytes32 => Claim) byId;
    mapping(uint256 => bytes32[]) byTopic;

    function getClaim(bytes32 _claimId) public view returns (uint256 topic, uint256 scheme, address issuer, bytes memory signature, bytes memory data, string memory uri){
        return (
        byId[_claimId].topic,
        byId[_claimId].scheme,
        byId[_claimId].issuer,
        byId[_claimId].signature,
        byId[_claimId].data,
        byId[_claimId].uri
        );
    }


    function addClaim(uint256 _topic, uint256 _scheme, address _issuer, bytes memory _signature, bytes memory _data, string memory _uri) public returns (bytes32 claimRequestId){
        if (msg.sender != address(this)) {
            require(keyHasPurpose(keccak256(abi.encodePacked(msg.sender)), 3), "Sender does not have claim signer key");
        }

        bytes32 claimId = keccak256(abi.encodePacked(_issuer, _topic));

        if (byId[claimId].issuer != _issuer) {
            byTopic[_topic].push(claimId);
        }

        byId[claimId].topic = _topic;
        byId[claimId].scheme = _scheme;
        byId[claimId].issuer = _issuer;
        byId[claimId].signature = _signature;
        byId[claimId].data = _data;
        byId[claimId].uri = _uri;

        emit ClaimAdded(
            claimId,
            _topic,
            _scheme,
            _issuer,
            _signature,
            _data,
            _uri
        );

        return claimId;
    }

    function removeClaim(bytes32 _claimId) public returns (bool success){
        if (msg.sender != address(this)) {
            require(keyHasPurpose(keccak256(abi.encodePacked(msg.sender)), 1), "Sender does not have management key");
        }

        emit ClaimRemoved(
            _claimId,
            byId[_claimId].topic,
            byId[_claimId].scheme,
            byId[_claimId].issuer,
            byId[_claimId].signature,
            byId[_claimId].data,
            byId[_claimId].uri
        );

        delete byId[_claimId];
        return true;
    }


    function getClaimIdsByTopic(uint256 _topic) public view returns (bytes32[] memory claimIds){
        return byTopic[_topic];
    }
}
