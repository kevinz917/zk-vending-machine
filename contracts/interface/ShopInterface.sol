//SPDX-License-Identifier: MIT
pragma solidity >=0.6.0 <0.9.0;

// The universal shop interface that every vending machine owner has to abide by.
interface Shop {
  function interact() external payable;
}
