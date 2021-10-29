//SPDX-License-Identifier: MIT
pragma solidity >=0.6.0 <0.9.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "./interface/ShopInterface.sol";
import "hardhat/console.sol";

// In this shop, the owner collects funds in return for an MVP.
// For instance, this contract could be deployed by a gaming DAO (like dfdao): when a user contributes funds
// to this DAO, they give the user back an NFT as a thank you memorabilia.
contract SampleShop2 is ERC721, Shop {
  mapping(uint256 => string) public tokenURIs;
  string public metadatUrl;
  uint256 public tokenId;

  constructor(string memory _metadataURL) ERC721("Badge", "BDG") {
    metadatUrl = _metadataURL;
  }

  // Main interact function the VendingMachine contract is calling
  function interact(address _sender) public payable override {
    require(msg.value > 1, "Insufficient fund");
    tokenURIs[tokenId] = metadatUrl;
    _mint(_sender, tokenId);
    tokenId++;
  }

  function tokenURI(uint256 _tokenid) public view override returns (string memory) {
    return tokenURIs[_tokenid];
  }
}
