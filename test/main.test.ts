import { expect } from "chai";
import { ethers as Ethers } from "ethers";
import { ethers } from "hardhat";
import { REVERT_MESSAGES, sampleRangeProof, fixtureLoader, initializeWorld, World } from "./helper";

const machineLocationHash = sampleRangeProof[3][0];
const INITIAL_OVERTAKE_FEE = 1;
const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";
const NFT_URL = "https://upload.wikimedia.org/wikipedia/en/thumb/5/5f/Original_Doge_meme.jpg/300px-Original_Doge_meme.jpg";

describe("ZK Vending Machine", () => {
  let world: World;

  before(async () => {
    world = await fixtureLoader(initializeWorld);
  });

  it("Overtake shop", async () => {
    await world.contracts.zkvmContract.overtake(...sampleRangeProof, { value: 10 });
    expect(await world.contracts.zkvmContract.shopOwners(machineLocationHash)).to.be.equal(world.users.user1.address);
    expect(await world.contracts.zkvmContract.overtakeFees(machineLocationHash)).to.be.equal(10);
  });

  it("Install new shop", async () => {
    await world.contracts.zkvmContract.install(...sampleRangeProof, world.contracts.shop1Contract.address);
    expect(await world.contracts.zkvmContract.destinations(machineLocationHash)).to.be.equal(world.contracts.shop1Contract.address);
  });

  it("Transact with new shop", async () => {
    await world.contracts.zkvmContract.transact(...sampleRangeProof, { value: 10 });
    expect(await world.contracts.shop1Contract.balances(world.users.user1.address)).to.be.equal(20);
  });

  it("Overtake shop", async () => {
    expect(world.contracts.zkvmContract.connect(world.users.user2).overtake(...sampleRangeProof, { value: 10 })).to.be.revertedWith(REVERT_MESSAGES.INVALID_STAKE); // fail to overtake shop: insufficient stake amount

    await world.contracts.zkvmContract.connect(world.users.user2).overtake(...sampleRangeProof, { value: 20 }); // successful overtake with correct stake amount
    expect(await world.contracts.zkvmContract.balances(world.users.user1.address)).to.be.equal(10);
    expect(await world.contracts.zkvmContract.shopOwners(machineLocationHash)).to.be.equal(world.users.user2.address);
    expect(await world.contracts.zkvmContract.overtakeFees(machineLocationHash)).to.be.equal(20);
  });

  it("Transact with overtaken shop", async () => {
    await world.contracts.zkvmContract.connect(world.users.user2).transact(...sampleRangeProof, { value: 20 });
    expect(await world.contracts.shop1Contract.balances(world.users.user2.address)).to.be.equal(40);

    expect(world.contracts.shop1Contract.connect(world.users.user2).interact(world.users.user2.address, { value: 200 })).to.be.revertedWith(REVERT_MESSAGES.OVERFLOW_TOKEN_SUPPLY); // fail to transact: overflow balance
  });

  it("Withdraw staked amount", async () => {
    expect(world.contracts.zkvmContract.connect(world.users.user3).withdraw()).to.be.revertedWith(REVERT_MESSAGES.EMPTY_BALANCE); // empty balance
    await world.contracts.zkvmContract.connect(world.users.user1).withdraw();
  });

  it("Withdraw tokens from shop1", async () => {
    expect(world.contracts.shop1Contract.connect(world.users.user3).withdraw()).to.be.revertedWith(REVERT_MESSAGES.EMPTY_BALANCE); // cannot withdraw empty balance

    await world.contracts.shop1Contract.connect(world.users.user2).withdraw();
    expect(await world.contracts.shop1Contract.balanceOf(world.users.user2.address)).to.be.equal(40);
    expect(await world.contracts.shop1Contract.balances(world.users.user2.address)).to.be.equal(0);
  });

  it("Interact with second shop", async () => {
    expect(world.contracts.shop2Contract.interact(world.users.user1.address, { value: 1 })).to.be.revertedWith(REVERT_MESSAGES.INSUFFICIENT_FUND); // fail: insufficient funds

    await world.contracts.shop2Contract.interact(world.users.user1.address, { value: 2 });
    expect(await world.contracts.shop2Contract.balanceOf(world.users.user1.address)).to.be.equal(1);
    expect(await world.contracts.shop2Contract.ownerOf(0)).to.be.equal(world.users.user1.address);
    expect(await world.contracts.shop2Contract.tokenURI(0)).to.be.equal(NFT_URL);
  });
});
