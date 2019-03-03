pragma solidity 0.5.0;

import "openzeppelin-solidity/contracts/token/ERC721/ERC721.sol";

contract Market {
    ERC721 private _token;
    uint32 _price;
    uint256 _tokenId;

    constructor(ERC721 token) public{
        _token = token;
    }

    function sell(uint256 tokenId, uint32 price) public returns (bool){
        _tokenId = tokenId;
        _price = price;
        return true;
    }

    function buy(uint256 tokenId) public returns (bool){
        _token.safeTransferFrom(_token.ownerOf(tokenId), msg.sender, tokenId);
        return true;
    }
}