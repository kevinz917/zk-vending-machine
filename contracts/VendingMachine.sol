//SPDX-License-Identifier: MIT
pragma solidity >=0.6.0 <0.9.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./RangeVerifier.sol";

contract VendingMachine is Ownable {
  Verifier public rangeVerifier;

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
  // any user can use this
  // TODO: Add mock token. Add ZK proof
  function transact(uint256 _locationHash) public payable {
    // bytes memory _initializationCalldata = abi.encodeWithSignature("initialize(uint256)", msg.sender, _num);
    (bool success, bytes memory data) = destinations[_locationHash].call{ value: msg.value }(abi.encodeWithSignature("interact()"));

    emit Transaction(success, msg.sender);
  }

  // Overtake vending machine
  // User becomes shopOwner and is allowed to install new "shops"
  function overtake(uint256 _locationHash) public payable {
    require(msg.value > overtakeFees[_locationHash], "Need more stake amount");
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

  // Modifiers
  modifier onlyShopOwner(uint256 _locationHash) {
    require(shopOwners[_locationHash] == msg.sender, "Not owner");
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
