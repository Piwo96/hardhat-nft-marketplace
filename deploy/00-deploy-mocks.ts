import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";

const deployMocks: DeployFunction = async (hre: HardhatRuntimeEnvironment) => {
    const { getNamedAccounts, deployments } = hre;
    const { deployer } = await getNamedAccounts();
    const { deploy, log } = deployments;

    log("Deploying Basic Nfts ...");
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
    log("Nfts deployed!");
    log("------------------------------------");
};

export default deployMocks;
