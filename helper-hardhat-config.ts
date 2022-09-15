interface NetworkConfigInfo {
    [id: number]: NetworkConfigItem;
}

interface NetworkConfigItem {
    blockConfirmations?: number;
}

export const networkConfig: NetworkConfigInfo = {
    31337: { blockConfirmations: 1 },
    4: { blockConfirmations: 6 },
    5: { blockConfirmations: 6 },
};

export const developmentChains = ["hardhat", "localhost"];
