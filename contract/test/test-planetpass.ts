// @ts-ignore
import { ethers } from "hardhat";
import { Signer } from "ethers";
import { expect } from "chai";

describe("Token", function () {
  let accounts: Signer[];
  let planetPass: any;

  beforeEach(async function () {
    accounts = await ethers.getSigners();

    const PlanetPass = await ethers.getContractFactory("WanderersPlanetPass");
    planetPass = await PlanetPass.connect(accounts[0]).deploy("example.com/");
    await planetPass.deployed();
  });

  it("should have the right uri", async function () {
    await planetPass.connect(accounts[0]).safeMint(await accounts[0].getAddress());
    expect(await planetPass.tokenURI(0)).to.equal("example.com/0");
  });

  it("should be able to change uri", async function () {
    await planetPass.connect(accounts[0]).safeMint(await accounts[0].getAddress());
    expect(await planetPass.tokenURI(0)).to.equal("example.com/0");

    await planetPass.connect(accounts[0]).updateBaseURI("emmy.org/");
    expect(await planetPass.tokenURI(0)).to.equal("emmy.org/0");
  });

});
