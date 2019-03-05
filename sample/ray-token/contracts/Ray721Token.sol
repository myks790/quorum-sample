pragma solidity 0.5.0;

import "openzeppelin-solidity/contracts/token/ERC721/ERC721Full.sol";
import "openzeppelin-solidity/contracts/drafts/Counter.sol";

contract Ray721Token is ERC721Full {
    using Counter for Counter.Counter;
    Counter.Counter private tokenId;

    constructor(string memory name, string memory symbol) ERC721Full(name, symbol) public{}

    function createToken(string memory tokenURI) public returns (bool)
    {
        uint256 nextTokenId = tokenId.next();
        _mint(msg.sender, nextTokenId);
        _setTokenURI(nextTokenId, tokenURI);
        return true;
    }

    function tokensOfOwner() public view returns(uint256[] memory){
        return _tokensOfOwner(msg.sender);
    }
}
