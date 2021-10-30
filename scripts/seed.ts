import { ethers as Ethers } from "ethers";
import { ethers } from "hardhat";
import { REVERT_MESSAGES, sampleRangeProof } from "../test/helper";

const machineLocationHash = sampleRangeProof[3][0];
const INITIAL_OVERTAKE_FEE = 1;
const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";
const NFT_URL = "https://upload.wikimedia.org/wikipedia/en/thumb/5/5f/Original_Doge_meme.jpg/300px-Original_Doge_meme.jpg";

const seedContracts = async () => {
  let zkvmContract: Ethers.Contract;
  let shop1Contract: Ethers.Contract;
  let shop2Contract: Ethers.Contract;
  let addr1: any;
  let addr2: any;
  let addr3: any;

  // initialize main vending machine
  zkvmContract = await (await ethers.getContractFactory("VendingMachine")).deploy([machineLocationHash], [INITIAL_OVERTAKE_FEE]);
  console.log("Vending Machine Contract: ", zkvmContract.address);

  // initialize two shops
  shop1Contract = await (await ethers.getContractFactory("SampleShop1")).deploy("DIAMOND", "DIA", 100); // ERC20 Shop
  console.log("Shop 1 Contract: ", shop1Contract.address);
  shop2Contract = await (await ethers.getContractFactory("SampleShop2")).deploy(NFT_URL); // NFT URL
  console.log("Shop 2 Contract: ", shop2Contract.address);
  [addr1, addr2, addr3] = await ethers.getSigners();
};

seedContracts();
