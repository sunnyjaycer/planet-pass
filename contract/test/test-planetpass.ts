// @ts-ignore
import { ethers } from "hardhat";
import { Signer } from "ethers";
import { expect } from "chai";

describe("Token", function () {
  let accounts: Signer[];
  let planetPass: any;
  let dummyErc721: any;

  beforeEach(async function () {
    accounts = await ethers.getSigners();

    const DummyErc721 = await ethers.getContractFactory("Dummy");
    dummyErc721 = await DummyErc721.connect(accounts[0]).deploy();
    await dummyErc721.deployed();

    const PlanetPass = await ethers.getContractFactory("WanderersPlanetPass");
    planetPass = await PlanetPass.connect(accounts[0]).deploy("example.com/", dummyErc721.address);
    await planetPass.deployed();
  });

  it("should be able to claim one", async function () {
    // Make token ID 0
    await dummyErc721.safeMint(await accounts[0].getAddress());
    // Claim it
    await planetPass.connect(accounts[0])['safeMint(address,uint256)'](await accounts[0].getAddress(), 0);
  });

  it("should be able to claim multiple", async function () {
    // Make token ID 0 to 9
    const claim = Array.from(Array(10).keys());

    for (let i = 0; i < claim.length; i++) {
      await dummyErc721.safeMint(await accounts[0].getAddress());
    }

    // Claim it
    await planetPass.connect(accounts[0])['safeMint(address,uint256[])'](await accounts[0].getAddress(), claim);
  });

  it("should not be able to claim someone else's", async function () {
    await dummyErc721.safeMint(await accounts[0].getAddress());

    expect(planetPass.connect(accounts[1])['safeMint(address,uint256)'](await accounts[1].getAddress(), 0))
    // @ts-ignore
    .to.be.revertedWith("Sender is not owner of token")
  });

  it("should not be able to claim twice", async function () {
    await dummyErc721.safeMint(await accounts[0].getAddress());
    await planetPass.connect(accounts[0])['safeMint(address,uint256)'](await accounts[0].getAddress(), 0);
    expect(planetPass.connect(accounts[0])['safeMint(address,uint256)'](await accounts[0].getAddress(), 0))
    // @ts-ignore
    .to.be.revertedWith("Token already used for claim");
  });

  it("should have the right uri", async function () {
    // Make token ID 0
    await dummyErc721.safeMint(await accounts[0].getAddress());
    // Claim it
    await planetPass.connect(accounts[0])['safeMint(address,uint256)'](await accounts[0].getAddress(), 0);

    expect(await planetPass.tokenURI(0)).to.equal("example.com/0");
  });

  it("should be able to change uri", async function () {
    // Make token ID 0
    await dummyErc721.safeMint(await accounts[0].getAddress());
    // Claim it
    await planetPass.connect(accounts[0])['safeMint(address,uint256)'](await accounts[0].getAddress(), 0);

    expect(await planetPass.tokenURI(0)).to.equal("example.com/0");

    await planetPass.connect(accounts[0]).updateBaseURI("emmy.org/");
    expect(await planetPass.tokenURI(0)).to.equal("emmy.org/0");
  });

});
