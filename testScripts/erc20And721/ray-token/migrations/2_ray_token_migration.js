var RayToken = artifacts.require("./RayToken.sol");

const _name = "RayToken";
const _symbol = "R";
const _decimals = 2;

module.exports = function(deployer) {
  deployer.deploy(RayToken, _name, _symbol, _decimals);
};