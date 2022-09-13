import { ethers, network } from "hardhat";
import { developmentChains } from "../helper-hardhat-config";
import { BasicNftOne, NftMarketplace } from "../typechain-types";
import moveBlocks from "../utils/move-blocks";

const PRICE = ethers.utils.parseEther("0.1");

async function mintAndList() {
    const accounts = await ethers.getSigners();
    const deployer = accounts[0];
    const nft: BasicNftOne = await ethers.getContract("BasicNftOne", deployer);
    const nftMarketplace: NftMarketplace = await ethers.getContract(
        "NftMarketplace",
        deployer
    );

    // Mint nft
    console.log("Minting ...");
    const mintTx = await nft.mintNft();
    const mintTxReceipt = await mintTx.wait(1);
    const tokenId = mintTxReceipt.events![1].args!.tokenId;

    // Approving nft
    console.log("Approving NFT ...");
    const approvalTx = await nft.approve(nftMarketplace.address, tokenId);
    await approvalTx.wait(1);

    // List nft
    console.log("Listing the NFT ...");

    const listingTx = await nftMarketplace.listItem(
        nft.address,
        tokenId,
        PRICE
    );
    await listingTx.wait(1);
    console.log("Listed!");

    if (developmentChains.includes(network.name)) {
        await moveBlocks(2, 1000);
    }
}

mintAndList()
    .then(() => process.exit(0))
    .catch((error) => {
        console.log(error);
        process.exit(1);
    });
