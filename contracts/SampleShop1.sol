//SPDX-License-Identifier: MIT
pragma solidity >=0.6.0 <0.9.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./interface/ShopInterface.sol";
import "hardhat/console.sol";

contract SampleShop1 is Shop {
  mapping(address => uint256) public reputations;

  constructor() {}

  event ExampleInteractionEvent(uint256 _value, address _sender);

  function interact(address _sender) public payable override {
    require(msg.value == 0, "Invalid amount");
    reputations[_sender] += 1;
    // sample interaction
    emit ExampleInteractionEvent(msg.value, msg.sender);
  }
}
