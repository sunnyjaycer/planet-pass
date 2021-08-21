import { ethers } from "ethers";
import { readFileSync, writeFileSync } from "fs";
import { keccak256 } from "keccak256";
import {MerkleTree} from "merkletreejs";

function hash(account: string, quantity: number) {
    return Buffer.from(
        ethers.utils.solidityKeccak256(
            ['address', 'uint256'],
            [account, quantity]
        ).slice(2), 'hex');
}

async function main() {
    let airdrop = readFileSync("output.json");
    airdrop = JSON.parse(airdrop.toString());

    let count: Map<string, number> = new Map();

    for (let i = 0; i < 8888; i++) {
        let address = ethers.utils.getAddress(airdrop[i].toString());

        // Update the mapping
        let ac = count.get(address) ?? 0;
        count.set(address, ac + 1);
    }

    const leaf = [];
    for (let [address, quantity] of count.entries()) {
        leaf.push(hash(address, quantity));
    }

    const merkleTree = new MerkleTree(leaf, keccak256, {sortPairs: true});
    console.log(merkleTree);

    const outputLeaves = MerkleTree.marshalLeaves(leaf);
    console.log(outputLeaves);
    writeFileSync("leaves.txt", outputLeaves);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
