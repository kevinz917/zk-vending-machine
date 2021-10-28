//SPDX-License-Identifier: MIT
pragma solidity >=0.6.0 <0.9.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Starter is Ownable {
  address public destination;
  address public shopOwner;
  uint256 public overtakeFee;

  event Transaction(bool _status, address _sender);

  constructor() {}

  // Transact
  // any user can use this
  // TODO: Add mock token. Add ZK proof
  function transact() public payable {
    // bytes memory _initializationCalldata = abi.encodeWithSignature("initialize(uint256)", msg.sender, _num);
    (bool success, bytes memory data) = destination.call{ value: msg.value }(abi.encodeWithSignature("interact()"));

    emit Transaction(success, msg.sender);
  }

  // Overtake vending machine
  // User becomes shopOwner and is allowed to install new "shops"
  function overtake() public payable {
    require(msg.value > overtakeFee, "Need more stake amount");
    overtakeFee = msg.value;
    shopOwner = msg.sender;
  }

  // Install new vending machine
  // This can be done only by the current shop owner
  function install(address _destination) public onlyShopOwner {
    destination = _destination;
  }

  // Modifiers
  modifier onlyShopOwner() {
    require(shopOwner == msg.sender, "Not owner");
    _;
  }
}
