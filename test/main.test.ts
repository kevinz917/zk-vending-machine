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
    zkvmContract = await (await ethers.getContractFactory("VendingMachine")).deploy([machineLocationHash], [INITIAL_OVERTAKE_FEE]);
    sampleShop1Contract = await (await ethers.getContractFactory("SampleShop1")).deploy();
    [addr1, addr2, addr3] = await ethers.getSigners();
  });

  it("Overtake shop", async () => {
    await zkvmContract.overtake(...sampleRangeProof, { value: 10 });
    expect(await zkvmContract.shopOwners(machineLocationHash)).to.be.equal(addr1.address);
    expect(await zkvmContract.overtakeFees(machineLocationHash)).to.be.equal(10);
  });

  it("Install new shop", async () => {
    await zkvmContract.install(...sampleRangeProof, sampleShop1Contract.address);
    expect(await zkvmContract.destinations(machineLocationHash)).to.be.equal(sampleShop1Contract.address);
  });

  it("Transact with new shop", async () => {
    await zkvmContract.transact(...sampleRangeProof);
    expect(await sampleShop1Contract.reputations(addr1.address)).to.be.equal(1);
  });

  it("Overtake shop", async () => {
    await zkvmContract.connect(addr2).overtake(...sampleRangeProof, { value: 20 });
    expect(await zkvmContract.shopOwners(machineLocationHash)).to.be.equal(addr2.address);
    expect(await zkvmContract.overtakeFees(machineLocationHash)).to.be.equal(20);
  });

  it("Transact with overtaken shop", async () => {
    await zkvmContract.connect(addr2).transact(...sampleRangeProof);
    expect(await sampleShop1Contract.reputations(addr2.address)).to.be.equal(1);
  });
});
