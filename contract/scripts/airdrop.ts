import { BigNumber, ethers } from "ethers";
import { id } from "ethers/lib/utils";
import { INFURA_PROJECT_ID, INFURA_PROJECT_SECRET } from "../secrets";
import "fs";
import { writeFileSync } from "fs";

const WANDERER_ADDRESS = "0x8184a482A5038B124d933B779E0Ea6e0fb72F54E";

const DEPLOYED_BLOCK = 13013300;   // make sure we start at block divisible by 10
const END_BLOCK = 13056640;
const SKIP_SIZE = 1000;


// Refer to https://ethereum.stackexchange.com/questions/61565/list-holders-and-tokens-for-an-erc-721-contract

async function main() {
    const provider = new ethers.providers.InfuraProvider("mainnet", {
        projectId: INFURA_PROJECT_ID,
        projectSecret: INFURA_PROJECT_SECRET
    });
    let owners: Map<number, string> = new Map();

    console.log("Fetching logs");

    let x = 0;
    for (let i = 0; i < (END_BLOCK - DEPLOYED_BLOCK) / SKIP_SIZE; i++) {
        const fromBlock = DEPLOYED_BLOCK + (i * SKIP_SIZE);
        let toBlock = fromBlock + SKIP_SIZE;
        if (toBlock > END_BLOCK) {
            toBlock = END_BLOCK;
        }

        console.log(fromBlock, toBlock, toBlock - fromBlock);
        const filter = {
            address: WANDERER_ADDRESS,
            topics: [
                id("Transfer(address,address,uint256)")
            ],
            fromBlock: fromBlock,
            toBlock: toBlock,
        }
        const logs = await provider.getLogs(filter);
        for (let log of logs) {
            const n = BigNumber.from(log.topics[3]);
            let a = ethers.utils.hexlify(log.topics[2]);
            a = ethers.utils.hexDataSlice(a, 12);
            owners.set(n.toNumber(), ethers.utils.getAddress(a).toString());
        }

        x += logs.length;
    }

    console.log("Fetched", x, "transfers");
    const json = JSON.stringify(Object.fromEntries(owners));
    writeFileSync("output.json", json);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
