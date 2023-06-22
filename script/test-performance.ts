/* eslint-disable no-console */
import { EthereumClient } from '../src';
import { InMemoryMetricTracker } from './InMemoryMetricTracker';
import * as yaml from 'js-yaml';
import * as fs from 'fs';
import * as path from 'path';

type Node = {
    url: string;
    address: string;
    transactionHash: string;
}

type Provider = {
    name: string;
    nodes: Node[];
}

type Config = {
    providers: Provider[];
}

// Create a map for url to provider name
export const urlToProvider: { [key: string]: string } = {};

// Create the tracker
const tracker = new InMemoryMetricTracker();

async function performTests() {
    // Load the configuration from the YAML file
    const configPath = path.join(__dirname, 'config.yaml');
    const fileContents = fs.readFileSync(configPath, 'utf8');
    const config: Config = yaml.load(fileContents) as Config;
    console.log("Starting your performance test ...");
    for (let i = 0; i < config.providers.length; i++) {
        const provider = config.providers[i];
        console.log(`Testing ${provider.name}`);
        for (let j = 0; j < provider.nodes.length; j++) {
            const node = provider.nodes[j];
            urlToProvider[node.url] = provider.name;  // Store provider name
            const client = new EthereumClient({ defaultNodeUrls: [node.url], metricTracker: tracker });

            // Now, instead of hardcoded addresses and transaction hashes, use the ones from config
            const address = node.address;
            const transactionHash = node.transactionHash;

            // Use the methods with the provided address and transactionHash
            await client.getBalance(address);
            await client.getBalance(address);
            await client.getBalance(address);
            await client.getBalance(address);
            await client.getBalance(address);
            await client.getBalance(address);
            await client.getBalance(address);
            await client.getTransactionCount(address);
            await client.getTransactionCount(address);
            await client.getTransactionCount(address);
            await client.getTransactionCount(address);
            await client.getTransactionCount(address);
            await client.getTransactionCount(address);
            // await client.getTransactionReceipt(transactionHash);
            // await client.getGasPrice();
            // For getLogs method you will need to provide an appropriate filter object
            // await client.getLogs(filterObject);
        }
    }
    console.log("\nTest Finished")
}

performTests().then(() => {
    // Once all the tests have completed, print the metrics
    tracker.logMetrics();
}).catch(error => {
    console.error('Error running performance tests:', error);
});

export {
    performTests
}