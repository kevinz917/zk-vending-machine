//SPDX-License-Identifier: MIT
pragma solidity >=0.6.0 <0.9.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./interface/ShopInterface.sol";

contract SampleShop1 is Shop {
  constructor() {}

  event Interaction(uint256 _value, address _sender);

  function interact() public payable override {
    emit Interaction(msg.value, msg.sender);
  }
}
