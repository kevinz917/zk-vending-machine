import { expect } from "chai";
import { ethers as Ethers } from "ethers";
import { ethers } from "hardhat";
import { REVERT_MESSAGES } from "./helper";
import { sampleRangeProof } from "./helper";

const machineLocationHash = sampleRangeProof[3][0];
const INITIAL_OVERTAKE_FEE = 1;
const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";
const NFT_URL = "https://upload.wikimedia.org/wikipedia/en/thumb/5/5f/Original_Doge_meme.jpg/300px-Original_Doge_meme.jpg";

describe("ZK Vending Machine", () => {
  let zkvmContract: Ethers.Contract;
  let shop1Contract: Ethers.Contract;
  let shop2Contract: Ethers.Contract;
  let addr1: any;
  let addr2: any;
  let addr3: any;

  before(async () => {
    // TODO: Add more initial vending machine locations :)))
    zkvmContract = await (await ethers.getContractFactory("VendingMachine")).deploy([machineLocationHash], [INITIAL_OVERTAKE_FEE]);
    shop1Contract = await (await ethers.getContractFactory("SampleShop1")).deploy("DIAMOND", "DIA", 100);
    shop2Contract = await (await ethers.getContractFactory("SampleShop2")).deploy(NFT_URL);
    [addr1, addr2, addr3] = await ethers.getSigners();
  });

  it("Overtake shop", async () => {
    await zkvmContract.overtake(...sampleRangeProof, { value: 10 });
    expect(await zkvmContract.shopOwners(machineLocationHash)).to.be.equal(addr1.address);
    expect(await zkvmContract.overtakeFees(machineLocationHash)).to.be.equal(10);
  });

  it("Install new shop", async () => {
    await zkvmContract.install(...sampleRangeProof, shop1Contract.address);
    expect(await zkvmContract.destinations(machineLocationHash)).to.be.equal(shop1Contract.address);
  });

  it("Transact with new shop", async () => {
    await zkvmContract.transact(...sampleRangeProof, { value: 10 });
    expect(await shop1Contract.balances(addr1.address)).to.be.equal(20);
  });

  it("Overtake shop", async () => {
    expect(zkvmContract.connect(addr2).overtake(...sampleRangeProof, { value: 10 })).to.be.revertedWith(REVERT_MESSAGES.INVALID_STAKE); // fail to overtake shop: insufficient stake amount

    await zkvmContract.connect(addr2).overtake(...sampleRangeProof, { value: 20 }); // successful overtake with correct stake amount
    expect(await zkvmContract.balances(addr1.address)).to.be.equal(10);
    expect(await zkvmContract.shopOwners(machineLocationHash)).to.be.equal(addr2.address);
    expect(await zkvmContract.overtakeFees(machineLocationHash)).to.be.equal(20);
  });

  it("Transact with overtaken shop", async () => {
    await zkvmContract.connect(addr2).transact(...sampleRangeProof, { value: 20 });
    expect(await shop1Contract.balances(addr2.address)).to.be.equal(40);

    expect(shop1Contract.connect(addr2).interact(addr2.address, { value: 200 })).to.be.revertedWith(REVERT_MESSAGES.OVERFLOW_TOKEN_SUPPLY); // fail to transact: overflow balance
  });

  it("Withdraw staked amount", async () => {
    expect(zkvmContract.connect(addr3).withdraw()).to.be.revertedWith(REVERT_MESSAGES.EMPTY_BALANCE); // empty balance
    await zkvmContract.connect(addr1).withdraw();
  });

  it("Withdraw tokens from shop1", async () => {
    expect(shop1Contract.connect(addr3).withdraw()).to.be.revertedWith(REVERT_MESSAGES.EMPTY_BALANCE); // cannot withdraw empty balance

    await shop1Contract.connect(addr2).withdraw();
    expect(await shop1Contract.balanceOf(addr2.address)).to.be.equal(40);
    expect(await shop1Contract.balances(addr2.address)).to.be.equal(0);
  });

  it("Interact with second shop", async () => {
    expect(shop2Contract.interact(addr1.address, { value: 1 })).to.be.revertedWith(REVERT_MESSAGES.INSUFFICIENT_FUND); // fail: insufficient funds

    await shop2Contract.interact(addr1.address, { value: 2 });
    expect(await shop2Contract.balanceOf(addr1.address)).to.be.equal(1);
    expect(await shop2Contract.ownerOf(0)).to.be.equal(addr1.address);
    expect(await shop2Contract.tokenURI(0)).to.be.equal(NFT_URL);
  });
});
