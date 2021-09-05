// @ts-ignore
import { ethers } from "hardhat";
import { BigNumber, Signer } from "ethers";
import { expect } from "chai";
import MerkleTree from "merkletreejs";
import { keccak256, parseEther, solidityPack } from "ethers/lib/utils";

describe("TravelAgency", function () {
    let accounts: Signer[];
    let planets: any;
    let pass: any;
    let agency: any;
    let dummyWeth: any;

    beforeEach(async function () {
        accounts = await ethers.getSigners();

        const zero = "0x0000000000000000000000000000000000000000000000000000000000000000"
        const Planets = await ethers.getContractFactory("WanderersPlanet");
        planets = await Planets.connect(accounts[0]).deploy("example.com/", zero);
        await planets.deployed();

        const Pass = await ethers.getContractFactory("WanderersPass");
        pass = await Pass.connect(accounts[0]).deploy(planets.address);
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
    });

    describe("updatePlanetContract", function () {
        let newPlanets: any;

        beforeEach(async function () {
            const zero = "0x0000000000000000000000000000000000000000000000000000000000000000"
            const Planets = await ethers.getContractFactory("WanderersPlanet");
            newPlanets = await Planets.connect(accounts[0]).deploy("new.com/", zero);
            await newPlanets.deployed();
        });

        it("should be able to update Planet contract address", async function () {
            expect(await agency.planetContract()).to.equal(planets.address);
            await agency.updatePlanetContract(newPlanets.address);
            expect(await agency.planetContract()).to.equal(newPlanets.address);
        });
    });

    describe("updatePassContract", function () {
        let newPass: any;

        beforeEach(async function () {
            const Pass = await ethers.getContractFactory("WanderersPass");
            newPass = await Pass.connect(accounts[0]).deploy(planets.address);
            await newPass.deployed();
        });

        it("should be able to update Pass contract address", async function () {
            expect(await agency.passContract()).to.equal(pass.address);
            await agency.updatePassContract(newPass.address);
            expect(await agency.passContract()).to.equal(newPass.address);
        });
    });

    describe("updatedWrappedEthContract", function () {
        let newDummyWeth: any;

        beforeEach(async function () {
            const DummyWeth = await ethers.getContractFactory("DummyWETH");
            newDummyWeth = await DummyWeth.connect(accounts[0]).deploy();
            await newDummyWeth.deployed();
        });

        it("should be able to update WETH contract address", async function () {
            expect(await agency.wrappedEthContract()).to.equal(dummyWeth.address);
            await agency.updateWrappedEthContract(newDummyWeth.address);
            expect(await agency.wrappedEthContract()).to.equal(newDummyWeth.address);
        });
    });

    describe("updateOperatorFeeBp", function () {
        it("should be able to update fee percent", async function () {
            const oldFee = await agency.operatorFeeBp();
            const newFee = oldFee + BigNumber.from(1);
            await agency.updateOperatorFeeBp(newFee);
            expect(await agency.operatorFeeBp()).to.equal(newFee);
        });
    });

    describe("deposit", function () {
        beforeEach(async function () {
            // Override batch-mint
            await planets.connect(accounts[0])['safeMint(address,uint256[])'](accounts[0].getAddress(), [0, 1, 2, 3, 4]);
            await planets.connect(accounts[0])['safeMint(address,uint256[])'](accounts[1].getAddress(), [5, 6, 7, 8, 9]);

        });

        context("when paused", function () {
            beforeEach(async function () {
                if (!agency.paused()) {
                    await agency.pause();
                }
            });

            it("should not be able to deposit", async function () {
                const address = await accounts[0].getAddress();
                const cost = solidityPack(["uint256"], [parseEther("1")]);

                expect(await planets.ownerOf(0)).to.equal(address);
                await expect(
                    planets.connect(accounts[0])['safeTransferFrom(address,address,uint256,bytes)'](
                        address,
                        agency.address,
                        0,
                        cost
                    )
                )
                    .to.be.revertedWith("Pausable: paused");
            });
        });

        context("when not paused", function () {
            beforeEach(async function () {
                if (agency.paused()) {
                    await agency.unpause();
                }
            });

            it("should be able to deposit with zero owner fee", async function () {
                const address = await accounts[0].getAddress();
                const cost = solidityPack(["uint256"], [parseEther("0")]);

                expect(await planets.ownerOf(0)).to.equal(address);
                await expect(
                    planets.connect(accounts[0])['safeTransferFrom(address,address,uint256,bytes)'](
                        address,
                        agency.address,
                        0,
                        cost
                    )
                )
                    .to.emit(planets, 'Transfer')
                    .withArgs(
                        address,
                        agency.address,
                        0
                    );

                expect(await agency.planetFees(0)).to.equal(parseEther("0"));
            });

            it("should be able to deposit with non-zero owner fee", async function () {
                const address = await accounts[0].getAddress();
                const cost = solidityPack(["uint256"], [parseEther("10")]);

                expect(await planets.ownerOf(0)).to.equal(address);
                await expect(
                    planets.connect(accounts[0])['safeTransferFrom(address,address,uint256,bytes)'](
                        address,
                        agency.address,
                        0,
                        cost
                    )
                )
                    .to.emit(planets, 'Transfer')
                    .withArgs(
                        address,
                        agency.address,
                        0
                    );

                expect(await agency.planetFees(0)).to.equal(parseEther("10"));
            });

            it("should not be able to deposit with no specified fee", async function () {
                const address = await accounts[0].getAddress();

                expect(await planets.ownerOf(0)).to.equal(address);
                await expect(
                    planets.connect(accounts[0])['safeTransferFrom(address,address,uint256)'](
                        address,
                        agency.address,
                        0
                    )
                )
                    .to.be.revertedWith("toUint256_outOfBounds");
            })
        })
    })

    const flashStampTests = {
        "should be able to be used by other users": async function () {
            await agency.connect(accounts[2]).flashStamp(0, 2);

            expect(await pass.ownerOf(2)).to.equal(await accounts[2].getAddress());

            const stamps = await pass.getStamps(2);
            expect(stamps.length).to.equal(1);
            expect(stamps[0]["planetId"]).to.equal(0);

            const feeBp = await agency.operatorFeeBp();
            const cost = await agency.planetFees(0);
            const operatorCut = cost.mul(feeBp).div(await agency.BASIS_POINTS_DIVISOR());
            expect(await agency.ownerFeesAccrued(await accounts[0].getAddress())).to.equal(cost.sub(operatorCut));
        },

        "should be able to be used by Planet owner": async function () {
            await agency.connect(accounts[0]).flashStamp(0, 0);

            expect(await pass.ownerOf(0)).to.equal(await accounts[0].getAddress());

            const stamps = await pass.getStamps(0);
            expect(stamps.length).to.equal(1);
            expect(stamps[0]["planetId"]).to.equal(0);

            expect(await agency.ownerFeesAccrued(await accounts[0].getAddress())).to.equal(0);
            expect(await agency.operatorFeeAccrued()).to.equal(0);
        }
    }

    describe("flashStamp", function () {
        beforeEach(async function () {
            // Override batch-mint
            await planets.connect(accounts[0])['safeMint(address,uint256[])'](accounts[0].getAddress(), [0, 1, 2, 3, 4]);
            await planets.connect(accounts[0])['safeMint(address,uint256[])'](accounts[1].getAddress(), [5, 6, 7, 8, 9]);

            // Set up passes
            await pass.connect(accounts[0]).safeMint(accounts[0].getAddress(), "Zero");
            await pass.connect(accounts[1]).safeMint(accounts[1].getAddress(), "One");
            await pass.connect(accounts[2]).safeMint(accounts[2].getAddress(), "Two");

            // Send 100 WETH to Address 1 and 2
            await dummyWeth.connect(accounts[0]).transfer(await accounts[1].getAddress(), parseEther("100"));
            await dummyWeth.connect(accounts[0]).transfer(await accounts[2].getAddress(), parseEther("100"));

            // Allow TravelAgency to spend WETH
            await dummyWeth.connect(accounts[0]).approve(agency.address, parseEther("1000000"));
            await dummyWeth.connect(accounts[1]).approve(agency.address, parseEther("1000000"));
            await dummyWeth.connect(accounts[2]).approve(agency.address, parseEther("1000000"));

            // Allow TravelAgency to use Passes
            await pass.connect(accounts[0]).setApprovalForAll(agency.address, true);
            await pass.connect(accounts[1]).setApprovalForAll(agency.address, true);
            await pass.connect(accounts[2]).setApprovalForAll(agency.address, true);

            if (agency.paused()) {
                await agency.unpause();
            }
        });

        context("with zero owner fees", function () {
            beforeEach(async function () {
                // Account 1 deposits planet 0
                const cost = solidityPack(["uint256"], [parseEther("0")]);
                await planets.connect(accounts[0])['safeTransferFrom(address,address,uint256,bytes)'](
                    await accounts[0].getAddress(),
                    agency.address,
                    0,
                    cost
                );
            });

            context("with zero operator fees", async function () {
                beforeEach(async function () {
                    await agency.updateOperatorFeeBp(0);
                });

                for (const [name, test] of Object.entries(flashStampTests)) {
                    it(name, test);
                }
            });

            context("with non-zero operator fees", async function () {
                beforeEach(async function () {
                    await agency.updateOperatorFeeBp(500);
                });

                for (const [name, test] of Object.entries(flashStampTests)) {
                    it(name, test);
                }
            });

            afterEach(async function () {
                // Zero owner fees implies zero operator fees
                expect(await agency.ownerFeesAccrued(accounts[0].getAddress())).to.equal(0);
                expect(await agency.operatorFeeAccrued()).to.equal(0);
            });
        });

        context("with non-zero owner fees", function () {
            let costWei: BigNumber;

            beforeEach(async function () {
                // Account 1 deposits planet 0
                costWei = parseEther("10");
                const cost = solidityPack(["uint256"], [costWei]);
                await planets.connect(accounts[0])['safeTransferFrom(address,address,uint256,bytes)'](
                    await accounts[0].getAddress(),
                    agency.address,
                    0,
                    cost
                );
            });

            context("with zero operator fees", async function () {
                beforeEach(async function () {
                    await agency.updateOperatorFeeBp(0);
                });

                for (const [name, test] of Object.entries(flashStampTests)) {
                    it(name, test);
                }
            });

            context("with non-zero operator fees", async function () {
                beforeEach(async function () {
                    await agency.updateOperatorFeeBp(500);
                });

                for (const [name, test] of Object.entries(flashStampTests)) {
                    it(name, test);
                }
            });
        });
    });
})