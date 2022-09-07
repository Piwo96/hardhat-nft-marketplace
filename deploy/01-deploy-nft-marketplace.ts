import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { networkConfig, developmentChains } from "../helper-hardhat-config";
import { verify } from "../utils/verify";

const deployNftMarketplace: DeployFunction = async (
    hre: HardhatRuntimeEnvironment
) => {
    const { network, getNamedAccounts, deployments } = hre;
    const { deployer } = await getNamedAccounts();
    const { deploy, log } = deployments;
    const chainId: number = network.config.chainId!;

    const blockConfirmations = networkConfig[chainId].blockConfirmations!;

    log("Deploying Nft marketplace ...");
    const nftMarketplace = await deploy("NftMarketplace", {
        contract: "NftMarketplace",
        from: deployer,
        log: true,
        waitConfirmations: blockConfirmations,
    });
    log("Marketplace deployed!");

    if (!developmentChains.includes(network.name)) {
        await verify(nftMarketplace.address, []);
    }
    log("---------------------------------------");
};

export default deployNftMarketplace;
deployNftMarketplace.tags = ["all"];
