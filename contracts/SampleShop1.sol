//SPDX-License-Identifier: MIT
pragma solidity >=0.6.0 <0.9.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "./interface/ShopInterface.sol";
import "hardhat/console.sol";

// Sample Shop
// Example of what a player designs as their shop. In this shop,
// sending the contract ETH will mint you a ERC20 token the shop owner designed :)s.
// A variation is that the ERC20 is an in-game token the owner deposits first.
contract SampleShop1 is Shop, ERC20 {
  mapping(address => uint256) public balances;
  uint256 public supply;

  constructor(
    string memory _name,
    string memory _symbol,
    uint256 _supply
  ) ERC20(_name, _symbol) {
    supply = _supply;
  }

  event ExampleInteractionEvent(uint256 _value, address _sender);

  // Main interact function the VendingMachine contract is calling
  function interact(address _sender) public payable override {
    require(msg.value > 0, "Invalid amount");
    require(totalSupply() + msg.value * 2 <= supply, "Over supply limit");
    approve(_sender, msg.value * 2);

    balances[_sender] += msg.value * 2; // sample interaction. TODO: Add safe math
    emit ExampleInteractionEvent(msg.value, msg.sender);
  }

  // Withdraw token
  function withdraw() public {
    uint256 amount = balances[msg.sender];
    require(amount != 0, "Balance is empty");
    _mint(msg.sender, amount);
    balances[msg.sender] = 0;
  }
}
