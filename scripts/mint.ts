import { ethers, network } from "hardhat";
import { BasicNftOne } from "../typechain-types";
import { developmentChains } from "../helper-hardhat-config";
import moveBlocks from "../utils/move-blocks";

async function mint() {
    const accounts = await ethers.getSigners();
    const minter = accounts[0];
    const nft: BasicNftOne = await ethers.getContract("BasicNftOne", minter);
    console.log("Minting ...");
    const tx = await nft.mintNft();
    const txReceipt = await tx.wait(1);
    const tokenId = txReceipt.events![0].args!.tokenId;
    console.log(`Minted NFT with tokenId ${tokenId}`);
    console.log(`NFT Address: ${nft.address}`);
    if (developmentChains.includes(network.name)) {
        await moveBlocks(2, 1000);
    }
}

mint()
    .then(() => process.exit(0))
    .catch((error) => {
        console.log(error);
        process.exit(1);
    });
