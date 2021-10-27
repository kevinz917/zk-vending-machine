//SPDX-License-Identifier: MIT
pragma solidity >=0.6.0 <0.9.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

struct character {
  uint256 attribute1;
  uint256 attribute2;
  uint256 attribute3;
  uint256 cHash;
  bool isRevealed;
}

contract Starter is Ownable {
  constructor() {}
}
