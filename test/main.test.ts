import { expect } from "chai";
import { ethers as Ethers } from "ethers";
import { ethers } from "hardhat";
import { revertMessages } from "./helper";

describe("PROGRAM_NAME", () => {
  let nftContract: Ethers.Contract;
  let addr1: any;
  let addr2: any;
  let addr3: any;

  before(async () => {
    nftContract = await (await ethers.getContractFactory("CONTRACT_NAME")).deploy();
    [addr1, addr2, addr3] = await ethers.getSigners();
  });

  it("FIRST_ACTION", async () => {
    // examples
    // await nftContract.mint(...initMintProofsArgs);
    // expect(nftContract.mint(...initMintWrongProofArgs)).to.be.revertedWith(revertMessages.INVALID_PROOF);
    // expect(await nftContract.balanceOf(addr1.address)).to.be.equal(1); // mint NFT
    // const character = await nftContract.characters(0);
    // expect(character.cHash).equal(initMintProofsArgs[3][0]);
    // expect(character.isRevealed).equal(false);
  });
});
