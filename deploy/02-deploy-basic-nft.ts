import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { developmentChains, networkConfig } from "../helper-hardhat-config";
import { verify } from "../utils/verify";

const deployMocks: DeployFunction = async (hre: HardhatRuntimeEnvironment) => {
    const { network, getNamedAccounts, deployments } = hre;
    const { deployer } = await getNamedAccounts();
    const { deploy, log } = deployments;
    const chainId: number = network.config.chainId!;

    const blockConfirmations = networkConfig[chainId].blockConfirmations!;

    log("Deploying Basic Nft ...");
    const nft = await deploy("BasicNftOne", {
        contract: "BasicNftOne",
        from: deployer,
        log: true,
        waitConfirmations: blockConfirmations,
    });
    log("Nft deployed!");

    if (!developmentChains.includes(network.name)) {
        await verify(nft.address, []);
    }
    log("------------------------------------");
};

export default deployMocks;
deployMocks.tags = ["all", "basicNft"];
