// @ts-ignore
import { ethers } from "hardhat";
import { Signer } from "ethers";
import { expect, use } from "chai";
import { solidity } from "ethereum-waffle";

use(solidity);

describe("WanderersPass", function () {
    let accounts: Signer[];
    let planets: any;
    let items: any;
    let pass: any;

    beforeEach(async function () {
        accounts = await ethers.getSigners();

        const zero = "0x0000000000000000000000000000000000000000000000000000000000000000"
        const Planets = await ethers.getContractFactory("WanderersPlanet");
        planets = await Planets.connect(accounts[0]).deploy("example.com/", zero);
        await planets.deployed();

        const Items = await ethers.getContractFactory("PlanetPassItems");
        items = await Items.connect(accounts[0]).deploy();
        await items.deployed();

        const Pass = await ethers.getContractFactory("WanderersPass");
        pass = await Pass.connect(accounts[0]).deploy(planets.address, items.address);
        await pass.deployed();
    })

    describe("safeMint", function () {
        context("when Pass creation is disabled", function () {
            beforeEach(async function () {
                // If not paused, then pause
                if (!await pass.paused()) {
                    await pass.pause();
                }
            })

            it("should not be able to make a new Pass", async function () {
                const address = accounts[0].getAddress();
                await expect(
                    pass.connect(accounts[0]).safeMint(address, "Test")
                )
                    .to.be.revertedWith("Pausable: paused")
            });
        })

        context("when Pass creation is enabled", function () {
            beforeEach(async function () {
                if (await pass.paused()) {
                    await pass.unpause();
                }
            })

            it("should be able to make a new Pass", async function () {
                const address = accounts[0].getAddress();
                await pass.connect(accounts[0]).safeMint(address, "Test");
            });

            it("should be able to make a new Pass with the same name", async function () {
                const address = accounts[0].getAddress();
                await pass.connect(accounts[0]).safeMint(address, "Test");
                await pass.connect(accounts[0]).safeMint(address, "Test");
                await pass.connect(accounts[1]).safeMint(accounts[1].getAddress(), "Test");
            });
        })
    });

    describe("setName", function () {
        beforeEach(async function () {
            if (await pass.paused()) {
                await pass.unpause();
            }
        })

        it("should be able to change name of pass", async function () {
            const address = accounts[0].getAddress();
            await pass.connect(accounts[0]).safeMint(address, "Test");
            expect(await pass.nameOfToken(0)).to.equal("Test");

            await pass['setName(uint256,string)'](0, "Test Two");
            expect(await pass.nameOfToken(0)).to.equal("Test Two");
        });

        it("non-owner should not be able to change name of pass", async function () {
            const address = accounts[0].getAddress();

            await pass.connect(accounts[0]).safeMint(address, "Test");
            expect(await pass.nameOfToken(0)).to.equal("Test");

            await expect(
                pass.connect(accounts[1])['setName(uint256,string)'](0, "Test Two")
            )
                .to.be.revertedWith("Not owner of token");
        });
    });

    describe("visitPlanet", function () {
        beforeEach(async function () {
            // Override batch-mint
            await planets.connect(accounts[0])['safeMint(address,uint256[])'](accounts[0].getAddress(), [0, 1, 2, 3, 4]);
            await planets.connect(accounts[0])['safeMint(address,uint256[])'](accounts[1].getAddress(), [5, 6, 7, 8, 9]);

            if (pass.paused()) {
                await pass.unpause();
            }
            await pass.connect(accounts[0]).safeMint(accounts[0].getAddress(), "One");
            await pass.connect(accounts[1]).safeMint(accounts[1].getAddress(), "Two");

        });

        it("should be able to stamp a planet", async function () {
            await expect(
                pass.connect(accounts[0])['visitPlanet(uint256,uint256)'](0, 0)
            )
                .to.emit(pass, 'Stamp')
                .withArgs(
                    accounts[0].getAddress,
                    0,
                    0,
                    0
                );

            const stamps = await pass.getVisits(0);

            expect(stamps.length).to.equal(1);
            expect(stamps[0]["planetId"]).to.equal(0);
            expect(stamps[0]["state"]).to.equal(0);
        });

        it("should not be able to stamp with non-owned planet", async function () {
            // 5-9 owned by account 1
            await expect(
                pass.connect(accounts[0])['visitPlanet(uint256,uint256)'](0, 6)
            )
                .to.be.revertedWith("Not owner of planet");
        });

        it("should not be able to stamp a non-owned Pass", async function () {
            await expect(
                pass.connect(accounts[0])['visitPlanet(uint256,uint256)'](1, 0)
            )
                .to.be.revertedWith("Not owner of pass");
        });

        it("should be able to batch-stamp", async function () {
            const stampPlanets = [0, 1, 2];
            await expect(
                pass.connect(accounts[0])['visitPlanet(uint256,uint256[])'](0, stampPlanets)
            )
                .to.emit(pass, 'Stamp')
                .withArgs(
                    accounts[0].getAddress,
                    0,
                    0,
                    0
                )
                .to.emit(pass, 'Stamp')
                .withArgs(
                    accounts[0].getAddress,
                    0,
                    1,
                    0
                )
                .to.emit(pass, 'Stamp')
                .withArgs(
                    accounts[0].getAddress,
                    0,
                    2,
                    0
                );

            const stamps = await pass.getVisits(0);

            expect(stamps.length).to.equal(3);
            for (let i = 0; i < 3; i++) {
                expect(stamps[i]["planetId"]).to.equal(stampPlanets[i]);
                expect(stamps[i]["state"]).to.equal(0);
            }
        })

        it("should not be able to batch-stamp with non-owned Planet", async function () {
            // 9 is not owned
            await expect(
                pass.connect(accounts[0])['visitPlanet(uint256,uint256[])'](0, [0, 1, 2, 9])
            )
                .to.be.revertedWith("Not owner of planet");
        });

        it("should not be able to batch-stamp a non-owned Pass", async function () {
            await expect(
                pass.connect(accounts[0])['visitPlanet(uint256,uint256[])'](1, [0, 1, 2, 3])
            )
                .to.be.revertedWith("Not owner of pass");
        });

        it("should be able to stamp into the correct Passport", async function () {
            // ID = 2
            await pass.connect(accounts[0]).safeMint(accounts[0].getAddress(), "Another One");

            await expect(
                pass.connect(accounts[0])['visitPlanet(uint256,uint256)'](0, 0)
            )
                .to.emit(pass, 'Stamp')
                .withArgs(
                    accounts[0].getAddress,
                    0,
                    0,
                    0
                );

            const stamps = await pass.getVisits(0);

            expect(stamps.length).to.equal(1);
            expect(stamps[0]["planetId"]).to.equal(0);
            expect(stamps[0]["state"]).to.equal(0);

            await expect(
                pass.connect(accounts[0])['visitPlanet(uint256,uint256)'](2, 1)
            )
                .to.emit(pass, 'Stamp')
                .withArgs(
                    accounts[0].getAddress,
                    2,
                    1,
                    0
                );

            const stampsTwo = await pass.getVisits(2);
            expect(stampsTwo.length).to.equal(1);
            expect(stampsTwo[0]["planetId"]).to.equal(1);
            expect(stampsTwo[0]["state"]).to.equal(0);

            const stampsOriginal = await pass.getVisits(0);
            expect(stampsOriginal.length).to.equal(1);
            expect(stampsOriginal[0]["planetId"]).to.equal(0);
            expect(stampsOriginal[0]["state"]).to.equal(0);

        })
    });

    describe("updatePlanetContract", function () {
        it("should be able to update Planet contract address", async function () {
            const zero = "0x0000000000000000000000000000000000000000000000000000000000000000"
            const Planets = await ethers.getContractFactory("WanderersPlanet");
            const planetsTwo = await Planets.connect(accounts[0]).deploy("updated.com/", zero);
            await planetsTwo.deployed();

            expect(await pass.planetContract()).to.equal(planets.address);
            await pass.updatePlanetContract(planetsTwo.address);
            expect(await pass.planetContract()).to.equal(planetsTwo.address);
        })
    });

    describe("tokensOfOwner", function () {
        beforeEach(async function () {
            if (await pass.paused()) {
                await pass.unpause();
            }
        });

        it("should be able to enumerate all Passes of an owner", async function () {
            const address = await accounts[0].getAddress();
            await pass.connect(accounts[0]).safeMint(address, "Test");
            await pass.connect(accounts[0]).safeMint(address, "Test");
            await pass.connect(accounts[0]).safeMint(address, "Test");

            const numberOfPasses = await pass.tokensOfOwner(address);
            expect(numberOfPasses.length).to.equal(3);
        });
    });
})