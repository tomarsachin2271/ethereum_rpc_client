interface NetworkConfig {
    nodeUrl: string;
}

const networkConfig: NetworkConfig[] = [
    { nodeUrl: 'https://rpc.ankr.com/eth' },
    { nodeUrl: 'https://rpc.ankr.com/bsc' },
    { nodeUrl: 'https://rpc.ankr.com/arbitrum' },
    { nodeUrl: 'https://rpc.ankr.com/polygon' },
    { nodeUrl: 'https://rpc.ankr.com/optimism' },
    { nodeUrl: 'https://rpc.ankr.com/moonbeam' },
    { nodeUrl: 'https://rpc.ankr.com/eth_goerli' },
    { nodeUrl: 'https://rpc.ankr.com/polygon_mumbai' }
];

export default networkConfig;
