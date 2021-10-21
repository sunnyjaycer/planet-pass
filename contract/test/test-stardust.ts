// @ts-ignore
import { ethers } from "hardhat";
import { BigNumber, Signer } from "ethers";
import { expect, use } from "chai";
import { solidity } from "ethereum-waffle";
import { parseEther, solidityPack } from "ethers/lib/utils";

use(solidity);

describe("Stardust", function () {
    let accounts: Signer[];
    let stardust: any;
    let planets: any;
    let pass: any;
    let items: any;
    let agency: any;
    let dummyWeth: any;

    beforeEach(async function () {
        accounts = await ethers.getSigners();

        const Stardust = await ethers.getContractFactory("WanderersPlanet");
        stardust = await Stardust.connect(accounts[0]).deploy();
        await stardust.deployed();

        const zero = "0x0000000000000000000000000000000000000000000000000000000000000000"
        const Planets = await ethers.getContractFactory("WanderersPlanet");
        planets = await Planets.connect(accounts[0]).deploy("example.com/", zero);
        await planets.deployed();

        const Items = await ethers.getContractFactory("PlanetPassItems");
        items = await Items.connect(accounts[0]).deploy();
        await items.deployed();

        await items.connect(accounts[0]).setItemType(0, "STAMP");
        await items.connect(accounts[0]).setItemType(1, "TEMPLATE");

        // Airdrop stamps to everyone
        for (let i = 0; i < 5; i++) {
            await items.connect(accounts[0]).mint(accounts[i].getAddress(), 0, 10, []);
            await items.connect(accounts[0]).mint(accounts[i].getAddress(), 1, 10, []);
        }

        const Pass = await ethers.getContractFactory("WanderersPass");
        pass = await Pass.connect(accounts[0]).deploy("", planets.address, items.address);
        await pass.deployed();
        await pass.unpause();

        const DummyWeth = await ethers.getContractFactory("DummyWETH");
        dummyWeth = await DummyWeth.connect(accounts[0]).deploy();
        await dummyWeth.deployed();

        const Agency = await ethers.getContractFactory("TravelAgency");
        agency = await Agency.connect(accounts[0]).deploy(
            0,
            planets.address,
            pass.address,
            dummyWeth.address
        );
        await agency.deployed();

        // ALlow Pass to burn
        for (let i = 0; i < 5; i++) {
            await items.connect(accounts[i]).setApprovalForAll(pass.address, true);
        }
    });

    describe("flashStamp", function () {

        beforeEach(async function () {
            // Override batch-mint
            await planets.connect(accounts[0])['safeMint(address,uint256[])'](accounts[0].getAddress(), [0, 1, 2, 3, 4]);
            await planets.connect(accounts[0])['safeMint(address,uint256[])'](accounts[1].getAddress(), [5, 6, 7, 8, 9]);

            // Set up passes
            await pass.connect(accounts[0]).safeMint(accounts[0].getAddress(), "Zero", 1);
            await pass.connect(accounts[1]).safeMint(accounts[1].getAddress(), "One", 1);
            await pass.connect(accounts[2]).safeMint(accounts[2].getAddress(), "Two", 1);

            // Send 100 WETH to Address 1 and 2
            await dummyWeth.connect(accounts[0]).transfer(await accounts[1].getAddress(), parseEther("100"));
            await dummyWeth.connect(accounts[0]).transfer(await accounts[2].getAddress(), parseEther("100"));

            // Allow TravelAgency to spend WETH
            await dummyWeth.connect(accounts[0]).approve(agency.address, parseEther("1000000"));
            await dummyWeth.connect(accounts[1]).approve(agency.address, parseEther("1000000"));
            await dummyWeth.connect(accounts[2]).approve(agency.address, parseEther("1000000"));

            // Allow TravelAgency to perform delegate visits
            await pass.connect(accounts[0]).setVisitDelegationApproval(agency.address, true);
            await pass.connect(accounts[1]).setVisitDelegationApproval(agency.address, true);
            await pass.connect(accounts[2]).setVisitDelegationApproval(agency.address, true);

            context("Minting authorized", function () {
                beforeEach(async function () {
                    // Account 0 deposits planet 0
                    const cost = solidityPack(["uint256"], [parseEther("0")]);
                    await planets.connect(accounts[0])['safeTransferFrom(address,address,uint256,bytes)'](
                        await accounts[0].getAddress(),
                        agency.address,
                        0,
                        cost
                    );
                    // The TravelAgency is permitted to mint Stardust
                    await stardust.connect(accounts[0]).setUpMinterRole(agency.address);
                    


                });

                it("testing", function () {

                })

            })
            

        });




    });
})