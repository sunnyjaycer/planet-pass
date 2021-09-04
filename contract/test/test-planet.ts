// @ts-ignore
import { ethers } from "hardhat";
import { Signer } from "ethers";
import { expect } from "chai";
import MerkleTree from "merkletreejs";
import keccak256 from 'keccak256';

// Hashing function that uses Solidity's tightly-packing + keccak256
export function hash(id: number, account: string): Buffer {
    return Buffer.from(
        ethers.utils.solidityKeccak256(
            ['uint256', 'address'],
            [id, account]
        ).slice(2), 'hex');
}

// Generate a test merkle tree for use in claims
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

describe("WanderersPlanet", function () {
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

    describe("claim", function () {
        context("when claim is disabled", function () {
            beforeEach(async function () {
                await planets.disableClaim();
            })

            it("should not be able to claim", async function () {
                const address = await accounts[0].getAddress();

                await expect(planets.connect(accounts[0]).claim(
                    address,
                    0,
                    merkleTree.getHexProof(hash(0, address))
                ))
                    // @ts-ignore
                    .to.be.revertedWith("Claim disabled");
            })
        })

        context("when claim is enabled", function () {
            beforeEach(async function () {
                await planets.enableClaim();
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
                const address = await accounts[0].getAddress();

                for (let i = 0; i < 5; i++) {
                    await planets.connect(accounts[0]).claim(
                        address,
                        i,
                        merkleTree.getHexProof(hash(i, address))
                    );
                }
            });

            it("should not be able to claim someone else's", async function () {
                const address = await accounts[1].getAddress();
                await expect(planets.connect(accounts[1]).claim(
                    address,
                    0,
                    merkleTree.getHexProof(hash(0, address))
                ))
                    // @ts-ignore
                    .to.be.revertedWith("Bad merkle proof");
            });

            it("should not be able to claim the same planet twice", async function () {
                const address = await accounts[0].getAddress();

                await planets.connect(accounts[0]).claim(
                    address,
                    0,
                    merkleTree.getHexProof(hash(0, address))
                );

                await expect(planets.connect(accounts[0]).claim(
                    address,
                    0,
                    merkleTree.getHexProof(hash(0, address))
                ))
                    // @ts-ignore
                    .to.be.revertedWith("ERC721: token already minted");
            });
        })
    });

    describe("uri", function () {
        beforeEach(async function () {
            await planets.enableClaim();
        });

        it("should have the right uri", async function () {
            const address = await accounts[0].getAddress();

            await planets.connect(accounts[0]).claim(
                address,
                0,
                merkleTree.getHexProof(hash(0, address))
            );

            expect(await planets.tokenURI(0)).to.equal("example.com/0");
        });

        it("should be able to change uri", async function () {
            const address = await accounts[0].getAddress();

            await planets.connect(accounts[0]).claim(
                address,
                0,
                merkleTree.getHexProof(hash(0, address))
            );

            await planets.connect(accounts[0]).updateBaseURI("emmy.org/");
            expect(await planets.tokenURI(0)).to.equal("emmy.org/0");
        });
    });

    describe("safeMint", function () {
        it("owner should be able to override mint", async function () {
            const address = await accounts[0].getAddress();
            await planets.connect(accounts[0])['safeMint(address,uint256)'](address, 0);

            await planets.connect(accounts[0])['safeMint(address,uint256)'](await accounts[1].getAddress(), 1);
        });

        it("non-owner should not be able to override mint", async function () {
            const address = await accounts[1].getAddress();
            await expect(
                planets.connect(accounts[1])['safeMint(address,uint256)'](address, 0)
            )
                // @ts-ignore
                .to.be.revertedWith("Ownable: caller is not the owner");
        });

        it("owner should be able to override batch-mint", async function () {
            const address = await accounts[0].getAddress();
            const tokensToMint = [...Array(25).keys()];

            await planets.connect(accounts[0])['safeMint(address,uint256[])'](address, tokensToMint);
        });

        it("non-owner should not be able to override batch-mint", async function () {
            const address = await accounts[1].getAddress();
            const tokensToMint = [...Array(25).keys()];

            await expect(
                planets.connect(accounts[1])['safeMint(address,uint256[])'](address, tokensToMint)
            )
                // @ts-ignore
                .to.be.revertedWith("Ownable: caller is not the owner");
        });
    });
});
