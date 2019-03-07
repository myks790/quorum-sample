pragma solidity 0.5.0;

import "openzeppelin-solidity/contracts/token/ERC721/ERC721.sol";
import "openzeppelin-solidity/contracts/token/ERC20/ERC20.sol";

contract Market {
    ERC20 private _token20;
    ERC721 private _token721;
    mapping(uint256 => uint32) private _tokenPrice;

    constructor(ERC20 token20, ERC721 token721) public{
        _token20 = token20;
        _token721 = token721;
    }

    function tokenPrice(uint256 tokenId) public view returns (uint32){
        return _tokenPrice[tokenId];
    }

    function sell(uint256 tokenId, uint32 price) public returns (bool){
        _tokenPrice[tokenId] = price;
        return true;
    }

    function buy(uint256 tokenId) public returns (bool){
        uint32 tokenPrice = _tokenPrice[tokenId];
        require(_token20.balanceOf(msg.sender) > _tokenPrice[tokenId]);
        if(_tokenPrice[tokenId] != 0){
            _tokenPrice[tokenId] = 0;
            address seller = _token721.ownerOf(tokenId);
            if(!_token20.transferFrom(msg.sender, seller, tokenPrice)){
                _tokenPrice[tokenId] = tokenPrice;
                return false;
            }
            _token721.safeTransferFrom(seller, msg.sender, tokenId);
            return true;
        }
        return false;
    }
}