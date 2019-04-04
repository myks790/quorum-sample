pragma solidity 0.5.0;

import "openzeppelin-solidity/contracts/ownership/Ownable.sol";
import "./IERC725v2.sol";

contract ProxyAccount is Ownable, IERC725v2 {
    event DataChanged(bytes32 indexed key, bytes32 indexed value);
    event OwnerChanged(address indexed ownerAddress);
    event ContractCreated(address indexed contractAddress);

    uint256 constant OPERATION_CALL = 0;
    uint256 constant OPERATION_CREATE = 1;

    constructor(address _owner) public {
        _transferOwnership(_owner);
    }

    mapping(bytes32 => bytes32) private _data;

    function changeOwner(address _owner) external {
        transferOwnership(_owner);
        emit OwnerChanged(_owner);
    }

    function getData(bytes32 _key) external view returns (bytes32 _value){
        return _data[_key];
    }

    function setData(bytes32 _key, bytes32 _value) external onlyOwner {
        _data[_key] = _value;
        emit DataChanged(_key, _value);
    }

    function execute(uint256 _operationType, address _to, uint256 _value, bytes calldata _data) external onlyOwner {
        (bool success,) = _to.call.value(_value)(_data);

//        if (_operationType == OPERATION_CALL) {
//            bool success = executeCall(_to, _value, _data, 70000);
//        } else if (_operationType == OPERATION_CREATE) {
//            address newContract = executeCreate(_data);
//            emit ContractCreated(newContract);
//        } else {
//            revert();
//        }
    }

    /**
     * Copyright (c) 2007 Free Software Foundation, Inc.
     * Released under the LGPL-3.0
     * https://github.com/gnosis/safe-contracts/blob/v0.1.0/LICENSE
     * Original Code
     * https://github.com/gnosis/safe-contracts/blob/v0.1.0/contracts/base/Executor.sol
     */
    function executeCall(address to, uint256 value, bytes memory data, uint256 txGas)
    internal
    returns (bool success)
    {
        // solium-disable-next-line security/no-inline-assembly
        assembly {
            success := call(txGas, to, value, add(data, 0x20), mload(data), 0, 0)
        }
    }

    /**
     * Copyright (c) 2007 Free Software Foundation, Inc.
     * Released under the LGPL-3.0
     * https://github.com/gnosis/safe-contracts/blob/v0.1.0/LICENSE
     * Original Code
     * https://github.com/gnosis/safe-contracts/blob/v0.1.0/contracts/base/Executor.sol
     */
    function executeCreate(bytes memory data)
    internal
    returns (address newContract)
    {
        // solium-disable-next-line security/no-inline-assembly
        assembly {
            newContract := create(0, add(data, 0x20), mload(data))
        }
    }
}