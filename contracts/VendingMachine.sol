//SPDX-License-Identifier: MIT
pragma solidity >=0.6.0 <0.9.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./RangeVerifier.sol";
import "hardhat/console.sol";

contract VendingMachine is Ownable {
  Verifier public rangeVerifier;

  mapping(address => uint256) public balances;
  mapping(uint256 => address) public destinations;
  mapping(uint256 => address) public shopOwners;
  mapping(uint256 => uint256) public overtakeFees;

  event Transaction(bool _status, address _sender);

  constructor(uint256[] memory _locationHashs, uint256[] memory _overtakeFees) {
    rangeVerifier = new Verifier();
    for (uint256 i = 0; i < _locationHashs.length; i++) {
      overtakeFees[_locationHashs[0]] = _overtakeFees[i];
    }
  }

  // Transact
  // user can transact with shop if within range defined by zkSNARK
  function transact(
    uint256[2] memory _a,
    uint256[2][2] memory _b,
    uint256[2] memory _c,
    uint256[2] memory _input
  ) public payable onlyInPosition(_a, _b, _c, _input) {
    (bool success, bytes memory data) = destinations[_input[0]].call{ value: msg.value }(abi.encodeWithSignature("interact(address)", msg.sender));

    emit Transaction(success, msg.sender);
  }

  // Overtake vending machine
  // User becomes shopOwner and is allowed to install new "shops"
  function overtake(
    uint256[2] memory _a,
    uint256[2][2] memory _b,
    uint256[2] memory _c,
    uint256[2] memory _input
  ) public payable onlyInPosition(_a, _b, _c, _input) {
    uint256 _locationHash = _input[0];
    require(msg.value > overtakeFees[_locationHash], "Need more stake amount");
    balances[shopOwners[_locationHash]] += overtakeFees[_locationHash]; // return previous take amount to previous owner, similar to bidding
    overtakeFees[_locationHash] = msg.value;
    shopOwners[_locationHash] = msg.sender;
  }

  // Install new vending machine
  // This can be done only by the current shop owner
  function install(
    uint256[2] memory _a,
    uint256[2][2] memory _b,
    uint256[2] memory _c,
    uint256[2] memory _input,
    address _destination
  ) public onlyShopOwner(_input[0]) onlyInPosition(_a, _b, _c, _input) {
    destinations[_input[0]] = _destination;
  }

  // Withdraw all balance for given address
  function withdraw() public {
    uint256 amount = balances[msg.sender];
    require(amount != 0, "Balance is empty");
    balances[msg.sender] = 0;
    payable(msg.sender).transfer(amount);
  }

  // Modifiers
  modifier onlyShopOwner(uint256 _locationHash) {
    require(shopOwners[_locationHash] == msg.sender, "Not shop owner");
    _;
  }

  // only users within position can interact with the shop
  modifier onlyInPosition(
    uint256[2] memory _a,
    uint256[2][2] memory _b,
    uint256[2] memory _c,
    uint256[2] memory _input
  ) {
    require(rangeVerifier.verifyProof(_a, _b, _c, _input), "Not in range");
    _;
  }
}
