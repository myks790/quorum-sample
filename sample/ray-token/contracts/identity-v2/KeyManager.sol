pragma solidity 0.5.0;


import "./ProxyAccount.sol";

contract KeyManager is ProxyAccount {

    uint256 public constant MANAGEMENT_KEY = 1;
    uint256 public constant EXECUTION_KEY = 2;

    event KeyAdded(bytes32 indexed key, uint256 indexed purpose, uint256 indexed keyType);
    event KeyRemoved(bytes32 indexed key, uint256 indexed purpose, uint256 indexed keyType);
    event ExecutionRequested(uint256 indexed executionId, address indexed to, uint256 indexed value, bytes data);
    event Executed(uint256 indexed executionId, address indexed to, uint256 indexed value, bytes data);
    event Approved(uint256 indexed executionId, bool approved);
    event KeysRequiredChanged(uint256 purpose, uint256 number);


    struct Key {
        uint256[] purposes; //e.g., MANAGEMENT_KEY = 1, EXECUTION_KEY = 2, etc.
        uint256 keyType; // e.g. 1 = ECDSA, 2 = RSA, etc.
        bytes32 key;
    }

    mapping(bytes32 => Key) private keys;
    mapping(uint256 => bytes32[]) private keysByPurpose;
    uint256 executionNonce;
//    ProxyAccount private proxyAccount;

    constructor() ProxyAccount(address(this)) public {
//        proxyAccount = new ProxyAccount(address(this));
        bytes32 _key = keccak256(abi.encodePacked(msg.sender));
        keys[_key].key = _key;
        keys[_key].purposes.push(MANAGEMENT_KEY);
        keys[_key].keyType = 1;
        keysByPurpose[1].push(_key);
        emit KeyAdded(_key, 1, 1);
    }

    function getKey(bytes32 _key) public view returns (uint256[] memory purposes, uint256 keyType, bytes32 key){
        return (keys[_key].purposes, keys[_key].keyType, keys[_key].key);
    }

    function keyHasPurpose(bytes32 _key, uint256 _purpose) public view returns (bool exists){
        if (keys[_key].key == 0) {
            return false;
        }

        for (uint i = 0; i < keys[_key].purposes.length; i++) {
            if (keys[_key].purposes[i] == _purpose) {
                return true;
            }
        }
        return false;
    }

    function getKeysByPurpose(uint256 _purpose) public view returns (bytes32[] memory keys){
        return keysByPurpose[_purpose];
    }

    /**
      * Copyright (c) 2018 Origin Protocol Inc
      * Released under the MIT License
      * https://github.com/OriginProtocol/origin/blob/159cc75b93103b4564a5728c47a150c0e734a004/LICENSE
      * Original Code
      * https://github.com/OriginProtocol/origin/blob/159cc75b93103b4564a5728c47a150c0e734a004/origin-contracts/contracts/identity/KeyHolderLibrary.sol
      * modified by Kang SangHun
      */
    function addKey(bytes32 _key, uint256 _purpose, uint256 _keyType) public returns (bool success){
        require(keys[_key].key != _key, "Key already exists");
        if (msg.sender != address(this)) {
            require(keyHasPurpose(keccak256(abi.encodePacked(msg.sender)), MANAGEMENT_KEY), "Sender does not have management key");
        }

        keys[_key].key = _key;
        keys[_key].purposes.push(_purpose);
        keys[_key].keyType = _keyType;

        keysByPurpose[_purpose].push(_key);

        emit KeyAdded(_key, _purpose, _keyType);

        return true;
    }

    /**
      * Copyright (c) 2018 Origin Protocol Inc
      * Released under the MIT License
      * https://github.com/OriginProtocol/origin/blob/159cc75b93103b4564a5728c47a150c0e734a004/LICENSE
      * Original Code
      * https://github.com/OriginProtocol/origin/blob/159cc75b93103b4564a5728c47a150c0e734a004/origin-contracts/contracts/identity/KeyHolderLibrary.sol
      * modified by Kang SangHun
      */
    function removeKey(bytes32 _key, uint256 _purpose) public returns (bool success){
        if (msg.sender != address(this)) {
            require(keyHasPurpose(keccak256(abi.encodePacked(msg.sender)), 1), "Sender does not have management key");
        }

        require(keys[_key].key == _key, "No such key");
        emit KeyRemoved(_key, _purpose, keys[_key].keyType);

        // Remove purpose from key
        uint256[] storage purposes = keys[_key].purposes;
        for (uint i = 0; i < purposes.length; i++) {
            if (purposes[i] == _purpose) {
                purposes[i] = purposes[purposes.length - 1];
                delete purposes[purposes.length - 1];
                purposes.length--;
                break;
            }
        }

        // If no more purposes, delete key
        if (purposes.length == 0) {
            delete keys[_key];
        }

        // Remove key from keysByPurpose
        bytes32[] storage keys = keysByPurpose[_purpose];
        for (uint j = 0; j < keys.length; j++) {
            if (keys[j] == _key) {
                keys[j] = keys[keys.length - 1];
                delete keys[keys.length - 1];
                keys.length--;
                break;
            }
        }

        return true;
    }


    function execute(address _to, uint256 _operationType, uint256 _value, bytes memory _data) public payable returns (uint256 executionId){
        //        require(!executions[_keyHolderData.executionNonce].executed, "Already executed");
        //        executions[_keyHolderData.executionNonce].to = _to;
        //        executions[_keyHolderData.executionNonce].value = _value;
        //        executions[_keyHolderData.executionNonce].data = _data;
        emit ExecutionRequested(executionNonce, _to, _value, _data);

        //        if (keyHasPurpose(keccak256(abi.encodePacked(msg.sender)), 1) || keyHasPurpose( keccak256(abi.encodePacked(msg.sender)), 2)) {
        //            approve(executionNonce, true);
        //        }
        this.execute(_operationType, _to, _value, _data);


        executionNonce++;
        return executionNonce - 1;
    }

    function changeKeysRequired(uint256 purpose, uint256 number) external {}

    function getKeysRequired(uint256 purpose) external view returns (uint256){}

    function approve(uint256 _id, bool _approve) public returns (bool success){
    }
}