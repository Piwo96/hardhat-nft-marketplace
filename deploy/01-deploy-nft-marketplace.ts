import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { NftMarketplace } from "../typechain-types";
import { networkConfig, developmentChains } from "../helper-hardhat-config";

const deployNftMarketplace: DeployFunction = async (
    hre: HardhatRuntimeEnvironment
) => {
    const { network, getNamedAccounts, deployments } = hre;
    const { deployer } = await getNamedAccounts();
    const { deploy, log } = deployments;
    const chainId: number = network.config.chainId!;
};

export default deployNftMarketplace;
