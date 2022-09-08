import { DeployFunction } from "hardhat-deploy/types";
import { network, ethers } from "hardhat";
import fs from "fs";

const FRONT_END_ADDRESSES_FILE =
    "../nextjs-nft-marketplace/constants/contractAddresses.json";
const FRONT_END_ABI_FILE = "../nextjs-nft-marketplace/constants/abi.json";

const updateUi: DeployFunction = async () => {
    if (process.env.UPDATE_FRONT_END == "true") {
        console.log("Updating front end ...");
        await updateContractAddresses();
        await updateAbi();
    }
};

async function updateContractAddresses() {
    const nftMarketplace = await ethers.getContract("NftMarketplace");
    const chainId = network.config.chainId!.toString();
    const currentAddresses: any = JSON.parse(
        fs.readFileSync(FRONT_END_ADDRESSES_FILE, "utf-8")
    );
    if (chainId in currentAddresses) {
        if (
            !currentAddresses[chainId]["NftMarketplace"].includes(
                nftMarketplace.address
            )
        ) {
            currentAddresses[chainId]["NftMarketplace"].push(
                nftMarketplace.address
            );
        }
    } else {
        currentAddresses[chainId] = {
            NftMarketplace: [nftMarketplace.address],
        };
    }
    fs.writeFileSync(
        FRONT_END_ADDRESSES_FILE,
        JSON.stringify(currentAddresses)
    );
}

async function updateAbi() {
    const abi: string = await getAbiFromBuild();
    fs.writeFileSync(FRONT_END_ABI_FILE, abi);
}

async function getAbiFromBuild(): Promise<string> {
    console.log("Reading ABI ...");
    const nftMarketplacePath =
        "artifacts/contracts/NftMarketplace.sol/NftMarketplace.json";
    return new Promise<string>((resolve, reject) => {
        fs.readFile(nftMarketplacePath, "utf-8", (err, data) => {
            if (err) {
                console.log(err);
                reject(err);
            } else {
                console.log("Parsing ABI ...");
                const obj = JSON.parse(data);
                const abi = JSON.stringify(obj.abi);
                resolve(abi);
            }
        });
    });
}

export default updateUi;
updateUi.tags = ["all", "frontend"];
