function Contract(transctionAddress) {
    var contractAddress =  eth.getTransactionReceipt(transctionAddress).contractAddress
    var abi = [{"constant":true,"inputs":[],"name":"storedData","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"x","type":"uint256"}],"name":"set","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"get","outputs":[{"name":"retVal","type":"uint256"}],"payable":false,"type":"function"},{"inputs":[{"name":"initVal","type":"uint256"}],"type":"constructor"}];
    this.contract = eth.contract(abi).at(contractAddress);
}

Contract.prototype.get = function(transctionAddress) {
    return this.contract.get();
}


Contract.prototype.set = function(value) {
    this.contract.set(value,{from:eth.accounts[0],privateFor:["ROAZBWtSacxXQrOe3FGAqJDyJjFePR5ce4TSIzmJ0Bc="]});
}
