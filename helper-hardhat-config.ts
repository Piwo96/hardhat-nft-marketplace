interface NetworkConfigInfo {
    [id: number]: NetworkConfigItem;
}

interface NetworkConfigItem {}

export const networkConfig: NetworkConfigInfo = {
    31337: {},
    4: {},
};

export const developmentChains = ["hardhat", "localhost"];
