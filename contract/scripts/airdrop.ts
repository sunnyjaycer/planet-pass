import { ethers } from "ethers";
import { INFURA_PROJECT_ID, INFURA_PROJECT_SECRET } from "../secrets";

// Refer to https://ethereum.stackexchange.com/questions/61565/list-holders-and-tokens-for-an-erc-721-contract

async function main() {
    const provider = new ethers.providers.InfuraProvider("mainnet", {
        projectId: INFURA_PROJECT_ID,
        projectSecret: INFURA_PROJECT_SECRET
    });
    let owners: Map<number, string> = new Map();
    console.log(owners.get(0));
    console.log(ethers.utils.formatEther(await provider.getBalance("esmeralda.eth")));
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
