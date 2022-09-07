import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { developmentChains } from "../helper-hardhat-config";
import { BasicNftOne, BasicNftTwo } from "../typechain-types";

const deployMocks: DeployFunction = async (hre: HardhatRuntimeEnvironment) => {
    const { network, getNamedAccounts, deployments } = hre;
    const { deployer } = await getNamedAccounts();
    const { deploy, log } = deployments;

    if (developmentChains.includes(network.name)) {
        console.log("Deploying Basic Nfts ...");
        await deploy("BasicNftOne", {
            contract: "BasicNftOne",
            from: deployer,
            log: true,
        });

        await deploy("BasicNftTwo", {
            contract: "BasicNftTwo",
            from: deployer,
            log: true,
        });
        console.log("Nfts deployed!");
        console.log("------------------------------------");
    }
};

export default deployMocks;
