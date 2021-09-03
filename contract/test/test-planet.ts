// @ts-ignore
import { ethers } from "hardhat";
import { Signer } from "ethers";
import { expect } from "chai";
import MerkleTree from "merkletreejs";
import keccak256 from 'keccak256';


export function hash(id: number, account: string): Buffer {
  return Buffer.from(
    ethers.utils.solidityKeccak256(
      ['uint256', 'address'],
      [id, account]
    ).slice(2), 'hex');
}

export async function makeTestMerkleTree(accounts: Signer[]): Promise<MerkleTree> {
  const leaf = []
  // Account 0 owns planets 0, 1, 2, 3, 4
  for (let i = 0; i < 5; i++) {
    leaf.push(hash(i, await accounts[0].getAddress()));
  }

  // Account 1 owns planet 5, 6, 7, 8, 9
  for (let i = 5; i < 10; i++) {
    leaf.push(hash(i, await accounts[1].getAddress()));
  }

  return new MerkleTree(leaf, keccak256, { sortPairs: true });
}

describe("Planets", function () {
  let accounts: Signer[];
  let planets: any;
  let merkleTree: MerkleTree;

  beforeEach(async function () {
    accounts = await ethers.getSigners();
    merkleTree = await makeTestMerkleTree(accounts);

    const Planets = await ethers.getContractFactory("WanderersPlanet");
    planets = await Planets.connect(accounts[0]).deploy("example.com/", merkleTree.getHexRoot());
    await planets.deployed();
  });

  it("should be able to claim one", async function () {
    const address = await accounts[0].getAddress();

    await planets.connect(accounts[0]).claim(
      address,
      0,
      merkleTree.getHexProof(hash(0, address))
    );
  });

  it("should be able to claim multiple", async function () {

  });

  it("should not be able to claim someone else's", async function () {

  });

  it("should not be able to claim the same planet twice", async function () {

  });

  it("should have the right uri", async function () {

  });

  it("should be able to change uri", async function () {

  });

});
