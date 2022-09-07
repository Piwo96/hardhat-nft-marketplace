import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { developmentChains } from "../helper-hardhat-config";
import { BasicNftOne, BasicNftTwo } from "../typechain-types";

const deployMocks: DeployFunction = async (hre: HardhatRuntimeEnvironment) => {
    const { network, getNamedAccounts, deployments } = hre;
    const { deployer } = await getNamedAccounts();
    const { deploy, log } = deployments;
};

export default deployMocks;
