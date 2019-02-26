pragma solidity 0.5.0;

import "openzeppelin-solidity/contracts/drafts/Counter.sol";
import "openzeppelin-solidity/contracts/token/ERC721/ERC721Full.sol";

contract Ray721Token is ERC721Full {
    using Counter for Counter.Counter;
    Counter.Counter private tokenId;

    constructor(string memory name, string memory symbol) ERC721Full(name, symbol) public{}


}
