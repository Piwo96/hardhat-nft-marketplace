import { ethers, network } from "hardhat";
import { NftMarketplace, BasicNftOne } from "../typechain-types";
import { developmentChains } from "../helper-hardhat-config";
import moveBlocks from "../utils/move-blocks";

const TOKEN_ID = 3;

async function buy() {
    const accounts = await ethers.getSigners();
    const buyer = accounts[1];
    const nftMarketplace: NftMarketplace = await ethers.getContract(
        "NftMarketplace",
        buyer
    );
    const basicNft: BasicNftOne = await ethers.getContract(
        "BasicNftOne",
        buyer
    );
    const listing = await nftMarketplace.getListing(basicNft.address, TOKEN_ID);
    const price = listing.price;
    const tx = await nftMarketplace.buyItem(basicNft.address, TOKEN_ID, {
        value: price,
    });
    await tx.wait(1);
    console.log("Bought NFT!");

    if (developmentChains.includes(network.name)) {
        await moveBlocks(1, 1000);
    }
}

buy()
    .then(() => process.exit(0))
    .catch((error) => {
        console.log(error);
        process.exit(1);
    });
