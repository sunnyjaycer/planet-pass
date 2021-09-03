import { ethers } from "ethers";
import { readFileSync, writeFileSync } from "fs";
import { keccak256 } from "keccak256";
import { MerkleTree } from "merkletreejs";

// Taken from https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
function shuffle(array: Array<number>) {
    var currentIndex = array.length, randomIndex: number;

    // While there remain elements to shuffle...
    while (currentIndex != 0) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        // And swap it with the current element.
        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]];
    }

    return array;
}

function hash(id: number, account: string): Buffer {
    return Buffer.from(
      ethers.utils.solidityKeccak256(
        ['uint256', 'address'],
        [id, account]
      ).slice(2), 'hex');
  }

async function main() {
    let airdrop = readFileSync("output.json");
    airdrop = JSON.parse(airdrop.toString());

    // Take 0 to 8887 and shuffle them
    let ordering = [...Array(8888).keys()];
    shuffle(ordering);

    // Mapping of token ID to address
    let mapping: Map<number, string> = new Map();

    for (let i = 0; i < 8888; i++) {
        let address = ethers.utils.getAddress(airdrop[i].toString());

        // Use the ordering as the tokenID, assign it to address
        mapping.set(ordering[i], address);
    }

    const leaf = [];
    for (let [tokenId, address] of mapping.entries()) {
        leaf.push(hash(tokenId, address));
    }

    const merkleTree = new MerkleTree(leaf, keccak256, { sortPairs: true });
    console.log(merkleTree);

    const outputLeaves = MerkleTree.marshalLeaves(leaf);
    console.log(outputLeaves);

    writeFileSync("root.txt", merkleTree.getHexRoot());
    writeFileSync("leaves.txt", outputLeaves);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
