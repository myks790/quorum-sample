pragma solidity 0.5.0;

import "openzeppelin-solidity/contracts/crowdsale/Crowdsale.sol";
import "openzeppelin-solidity/contracts/crowdsale/emission/MintedCrowdsale.sol";
import "openzeppelin-solidity/contracts/token/ERC20/ERC20Mintable.sol";

contract MyCrowdsale is Crowdsale, MintedCrowdsale {
    constructor(uint256 rate, address payable wallet, ERC20 token)
    MintedCrowdsale()
    Crowdsale(rate, wallet, token)
    public{}
}