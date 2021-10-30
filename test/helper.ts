import { ethers, waffle } from "hardhat";
import { ethers as Ethers } from "ethers";

// see fixtures: https://ethereum-waffle.readthedocs.io/en/latest/fixtures.html
export const fixtureLoader = waffle.createFixtureLoader();

// default world fixture
// export const defaultWorldFixture = ()

export interface World {
  contracts: {
    zkvmContract: Ethers.Contract;
    shop1Contract: Ethers.Contract;
    shop2Contract: Ethers.Contract;
  };
  users: {
    user1: any;
    user2: any;
    user3: any;
  };
}
// initialize world params
export const initializeWorld = async (): Promise<World> => {
  let zkvmContract: Ethers.Contract;
  let shop1Contract: Ethers.Contract;
  let shop2Contract: Ethers.Contract;
  let user1: any;
  let user2: any;
  let user3: any;

  // TODO: Add more initial vending machine locations :)))
  zkvmContract = await (await ethers.getContractFactory("VendingMachine")).deploy([machineLocationHash], [INITIAL_OVERTAKE_FEE]);
  shop1Contract = await (await ethers.getContractFactory("SampleShop1")).deploy("DIAMOND", "DIA", 100);
  shop2Contract = await (await ethers.getContractFactory("SampleShop2")).deploy(NFT_URL);
  [user1, user2, user3] = await ethers.getSigners();

  return {
    contracts: {
      zkvmContract,
      shop1Contract,
      shop2Contract,
    },
    users: {
      user1,
      user2,
      user3,
    },
  };
};

//// CONSTANTS

export const sampleRangeProof = [
  ["0x00ee42cc672d1cf1d50a4b9e54914b56a50edf56ef0a757a9f4fd6c6ab4ae03c", "0x04ca07f137b49416e9c4b9dec50decbd13c92798bc885a0ac4322fe36c9f8842"],
  [
    ["0x273b3114a2c537c459d919f2376fa4d8a46c54d13a16e4645459c6a81a970145", "0x07c62d8e494126f159766908859c5e468d6a5ae77a7bcc0660667063be747582"],
    ["0x069db49f72e928790626d9a2d8d19bfc106cf0eb5eeaa639280b6a1d7bb945a6", "0x250523860b87f8034e46dc2ec42bad37ec573d53bb7ad4b8d810f369f5f07a89"],
  ],
  ["0x1d5cff2d05c2997de119891200f7be88fbf5be92b1953752686805d297097c14", "0x2fed7365ba3123f910da367458ec9c98d2ea5a9598652ffd0b7e9929a0785bef"],
  ["0x2d9fea8398a61ea1997e7d748364c0fdb49412c4dbabc1578375ade642e85581", "0x000000000000000000000000000000000000000000000000000000000000000a"],
];

export const machineLocationHash = sampleRangeProof[3][0];
export const INITIAL_OVERTAKE_FEE = 1;
export const NFT_URL = "https://upload.wikimedia.org/wikipedia/en/thumb/5/5f/Original_Doge_meme.jpg/300px-Original_Doge_meme.jpg";

export enum REVERT_MESSAGES {
  INVALID_PROOF = "Proof is not valid",
  INVALID_OWNER = "Not shop owner",
  INVALID_RANGE = "Not in range",
  INVALID_STAKE = "Need more stake amount",
  EMPTY_BALANCE = "Balance is empty",
  OVERFLOW_TOKEN_SUPPLY = "Over supply limit",
  INSUFFICIENT_FUND = "Insufficient fund",
}
