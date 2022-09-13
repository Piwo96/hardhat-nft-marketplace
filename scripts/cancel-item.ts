import { ethers, network } from "hardhat";
import { NftMarketplace, BasicNftOne } from "../typechain-types";
import { developmentChains } from "../helper-hardhat-config";
import moveBlocks from "../utils/move-blocks";

const TOKEN_ID = 0;

async function cancle() {
    const accounts = await ethers.getSigners();
    const deployer = accounts[0];
    const nftMarketplace: NftMarketplace = await ethers.getContract(
        "NftMarketplace",
        deployer
    );
    const basicNft: BasicNftOne = await ethers.getContract(
        "BasicNftOne",
        deployer
    );
    const tx = await nftMarketplace.cancelListing(basicNft.address, TOKEN_ID);
    await tx.wait(1);
    console.log("Nft Canceled!");
    if (developmentChains.includes(network.name)) {
        await moveBlocks(1, 1000);
    }
}

cancle()
    .then(() => process.exit(0))
    .catch((error) => {
        console.log(error);
        process.exit(1);
    });
