import { network } from "hardhat";

export default async function moveBlocks(amount: number, sleepAmount?: number) {
    console.log("Moving blocks ...");
    for (let i = 0; i < amount; i++) {
        await network.provider.request({
            method: "evm_mine",
            params: [],
        });
        if (sleepAmount) {
            console.log(`Sleeping for ${sleepAmount}`);
            await sleep(sleepAmount);
        }
    }
}

function sleep(timeInMs: number) {
    return new Promise<void>((resolve) => {
        setTimeout(resolve, timeInMs);
    });
}
