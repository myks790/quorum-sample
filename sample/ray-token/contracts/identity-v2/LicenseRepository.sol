pragma solidity 0.5.0;

import "./ClaimHolderV2.sol";
import "./ClaimVerifier.sol";


//개인 정보가 존재하고 public체인 상에서 모든 데이터를 볼 수 있기 때문에 다른 private 블록체인 또는 서버로 이동 필요
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

    //블록체인에서 데이터만 저장하고
    //블록체인보다 접근 제어가 되는 서버에서 조립 반환이 더 옳다???
    function getLicense(address _personalHolder, bytes32 claimId) public returns (string memory, int32, string memory){
        bool e = !trustedClaimHolder.keyHasPurpose(keccak256(abi.encodePacked(_personalHolder)), trustedClaimHolder.MANAGEMENT_KEY());
        require(e == false);

        ClaimHolderV2 personalHolder = ClaimHolderV2(_personalHolder);

        (uint256 topic, uint256 scheme, address issuer, bytes memory signature, bytes memory data, string memory uri) = personalHolder.getClaim(claimId);

        string memory name = '';
        int32 age = -1;
        (bytes32 licenseKey,string memory selectedInfo, string memory expirationDate) = abi.decode(data, (bytes32, string, string));
        if(keccak256(abi.encodePacked(selectedInfo)) == keccak256('name')){
            name = licenses[licenseKey].name;
        }
        if(keccak256(abi.encodePacked(selectedInfo)) == keccak256('age')){
            age = int32(licenses[licenseKey].age);
        }

        return (name, age, expirationDate);
    }
}
