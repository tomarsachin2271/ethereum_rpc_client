interface NetworkConfig {
    nodeUrls: string[];
}

export const networkConfig: NetworkConfig[] = [
    { nodeUrls: ['https://rpc.ankr.com/eth'] },
    { nodeUrls: ['https://rpc.ankr.com/bsc'] },
    { nodeUrls: ['https://rpc.ankr.com/arbitrum'] },
    { nodeUrls: ['https://rpc.ankr.com/polygon'] },
    { nodeUrls: ['https://rpc.ankr.com/optimism'] },
    { nodeUrls: ['https://rpc.ankr.com/moonbeam'] },
    { nodeUrls: ['https://rpc.ankr.com/eth_goerli'] },
    { nodeUrls: ['https://rpc.ankr.com/polygon_mumbai'] }
];

export  const uniNetworkConfig: NetworkConfig[] = [
    { nodeUrls: ['https://rpc.ankr.com/eth'] },
    { nodeUrls: ['https://rpc.ankr.com/eth_goerli'] },
    { nodeUrls: ['https://rpc.ankr.com/arbitrum'] },
    { nodeUrls: ['https://rpc.ankr.com/optimism'] },
    { nodeUrls: ['https://rpc.ankr.com/polygon'] },
]

