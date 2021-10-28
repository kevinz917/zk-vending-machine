import { expect } from "chai";
import { ethers as Ethers } from "ethers";
import { ethers } from "hardhat";
import { revertMessages } from "./helper";
import { sampleRangeProof } from "./helper";

const machineLocationHash = sampleRangeProof[3][0];
const INITIAL_OVERTAKE_FEE = 1;
const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";

describe("ZK Vending Machine", () => {
  let zkvmContract: Ethers.Contract;
  let sampleShop1Contract: Ethers.Contract;
  let addr1: any;
  let addr2: any;
  let addr3: any;

  before(async () => {
    zkvmContract = await (await ethers.getContractFactory("VendingMachine")).deploy(machineLocationHash, INITIAL_OVERTAKE_FEE);
    sampleShop1Contract = await (await ethers.getContractFactory("SampleShop1")).deploy();
    [addr1, addr2, addr3] = await ethers.getSigners();
  });

  it("Initialize machine", async () => {
    expect(await zkvmContract.locationHash()).to.be.equal(machineLocationHash);
  });

  it("Overtake shop", async () => {
    await zkvmContract.overtake({ value: 10 });
    expect(await zkvmContract.shopOwner()).to.be.equal(addr1.address);
    expect(await zkvmContract.overtakeFee()).to.be.equal(10);
  });

  it("Install new shop", async () => {
    await zkvmContract.install(...sampleRangeProof, sampleShop1Contract.address);
    expect(await zkvmContract.destination()).to.be.equal(sampleShop1Contract.address);
  });
});

// examples
// await nftContract.mint(...initMintProofsArgs);
// expect(nftContract.mint(...initMintWrongProofArgs)).to.be.revertedWith(revertMessages.INVALID_PROOF);
// expect(await nftContract.balanceOf(addr1.address)).to.be.equal(1); // mint NFT
// const character = await nftContract.characters(0);
// expect(character.cHash).equal(initMintProofsArgs[3][0]);
// expect(character.isRevealed).equal(false);
