pragma solidity 0.5.0;

import "./ClaimHolderV2.sol";
import "./ClaimVerifier.sol";


contract LicenseRepository {

    ClaimHolderV2 public trustedClaimHolder;

    event licenseAdded(bytes32 key);

    struct License {
        string name;
        uint32 age;
    }

    mapping(bytes32 => License) private licenses;
    mapping(address => bytes32) private ids;

    uint256 private nonce;

    constructor(address _trustedClaimHolder)
    public{
        trustedClaimHolder = ClaimHolderV2(_trustedClaimHolder);
    }

    function addLicense(address holderAddr, string memory _name, uint32 _age) public returns (bytes32 licenseKey) {
        nonce += 1;
        bytes32 key = keccak256(abi.encodePacked(nonce));

        licenses[key].name = _name;
        licenses[key].age = _age;

        ids[holderAddr] = key;
        emit licenseAdded(key);
        return key;
    }


    function getLicense(bytes32 key) public returns (string memory name, uint32 age, bool expired) {
        bool e = !trustedClaimHolder.keyHasPurpose(keccak256(abi.encodePacked(msg.sender)), trustedClaimHolder.MANAGEMENT_KEY());
        return (
        licenses[key].name,
        licenses[key].age,
        e
        );
    }


}
