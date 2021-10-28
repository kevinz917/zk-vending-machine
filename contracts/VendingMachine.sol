//SPDX-License-Identifier: MIT
pragma solidity >=0.6.0 <0.9.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./RangeVerifier.sol";

contract Starter is Ownable {
  Verifier public rangeVerifier;

  uint256 public locationHash;
  address public destination;
  address public shopOwner;
  uint256 public overtakeFee;

  event Transaction(bool _status, address _sender);

  constructor() {
    rangeVerifier = new Verifier();
  }

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
  function install(
    uint256[2] memory _a,
    uint256[2][2] memory _b,
    uint256[2] memory _c,
    uint256[2] memory _input,
    address _destination
  ) public onlyShopOwner onlyInPosition(_a, _b, _c, _input) {
    destination = _destination;
  }

  // Modifiers
  modifier onlyShopOwner() {
    require(shopOwner == msg.sender, "Not owner");
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
