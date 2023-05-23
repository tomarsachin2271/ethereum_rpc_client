import { EthereumClient } from '../../src';
import axios from 'axios';

jest.mock('axios');

// This sets the mock adapter on the default instance
var mock = axios as jest.Mocked<typeof axios>;
mock.create = jest.fn(() => mock);


// Initialize the EthereumClient with a default node URL
const client = new EthereumClient({ defaultNodeUrl: 'http://localhost:8545' });

// helper function to mock an Ethereum RPC method
// Add a new optional parameter to mockEthMethod for the error response
function mockEthMethod(method: string, params: any[], result: any, error?: any) {
    mock.post.mockResolvedValueOnce({
        data: {
            jsonrpc: '2.0',
            id: 1,
            result: error ? undefined : result,
            error: error ? { code: -32000, message: error } : undefined
        }
    });
}


describe('EthereumClient method tests without MetricTracker', () => {

    afterEach(() => jest.clearAllMocks());

    // test getBalance
    it('should call the getBalance method and return the result', async () => {
        const address = '0x1234';
        const result = '0x5678';

        // Mock the response for the eth_getBalance method
        mockEthMethod('eth_getBalance', [address, 'latest'], result);

        const balance = await client.getBalance(address);
        expect(balance).toEqual(result);
    });

    // test getBalance error handling
    it('should throw an error when getBalance fails due to an RPC error', async () => {
        const address = '0x1234';
        const errorMessage = 'RPC error';

        // Mock an error response for the eth_getBalance method
        mockEthMethod('eth_getBalance', [address, 'latest'], undefined, errorMessage);

        // Assert that calling getBalance throws an error
        await expect(client.getBalance(address)).rejects.toThrow(errorMessage);
    });


    // test getBalance error handling
    it('should throw an error when getBalance fails', async () => {
        const address = '0x1234';

        // Mock an error response for the eth_getBalance method
        mock.post.mockRejectedValueOnce(new Error('Exception while calling axios'));

        // Assert that calling getBalance throws an error
        await expect(client.getBalance(address)).rejects.toThrowError(new Error('Exception while calling axios'));
    });

    // Test handling of network error in makeRPCRequest method
    it('should throw an error when network request fails', async () => {
        const address = '0x1234';

        // Simulate a network error by throwing an error when eth_getBalance is called
        mock.post.mockRejectedValueOnce(new Error('Network Error'));

        // Assert that calling getBalance throws an error
        await expect(client.getBalance(address)).rejects.toThrow('Network Error');
    });


    // test getBalance with custom node URl
    it('should call the getBalance method with custom nodeUrl and return the result', async () => {
        const address = '0x1234';
        const result = '0x5678';
        const customNodeUrl = 'http://customnodeurl:8545';

        const customMock = axios as jest.Mocked<typeof axios>;
        customMock.create = jest.fn(() => customMock);

        // Mock the response for the eth_getBalance method
        mockEthMethod('eth_getBalance', [address, 'latest'], result);

        const balance = await client.getBalance(address, customNodeUrl);
        expect(balance).toEqual(result);

        // Check that the mocked axios post method was called with the custom node URL
        expect((customMock.post as jest.Mock).mock.calls[0][0]).toEqual('');
        expect((customMock.create as jest.Mock).mock.calls[0][0].baseURL).toEqual(customNodeUrl);
    });


    // test getTransactionCount
    it('should call the getTransactionCount method and return the result', async () => {
        const address = '0x1234';
        const result = '0x2';

        // Mock the response for the eth_getTransactionCount method
        mockEthMethod('eth_getTransactionCount', [address, 'latest'], result);

        const txCount = await client.getTransactionCount(address);
        expect(txCount).toEqual(result);
    });

    // test getChainId
    it('should call the getChainId method and return the result', async () => {
        const result = '0x1';

        // Mock the response for the eth_chainId method
        mockEthMethod('eth_chainId', [], result);

        const chainId = await client.getChainId();
        expect(chainId).toEqual(result);
    });

    // test getBlockNumber
    it('should call the getBlockNumber method and return the result', async () => {
        const result = '0x1';

        // Mock the response for the eth_blockNumber method
        mockEthMethod('eth_blockNumber', [], result);

        const blockNumber = await client.getBlockNumber();
        expect(blockNumber).toEqual(result);
    });

    // test getTransactionReceipt
    it('should call the getTransactionReceipt method and return the result', async () => {
        const transactionHash = '0x1234';
        const result = {
            transactionHash: transactionHash,
            // add other fields as per your application's needs
        };

        // Mock the response for the eth_getTransactionReceipt method
        mockEthMethod('eth_getTransactionReceipt', [transactionHash], result);

        const receipt = await client.getTransactionReceipt(transactionHash);
        expect(receipt).toEqual(result);
    });

    it('should call the getBlockByNumber method and return the result', async () => {
        const blockNumber = '0x1';
        const result = {
            number: blockNumber,
            // add other block fields as needed
        };

        // Mock the response for the eth_getBlockByNumber method
        mockEthMethod('eth_getBlockByNumber', [blockNumber, true], result);

        const block = await client.getBlockByNumber(blockNumber);
        expect(block).toEqual(result);
    });

    it('should call the call method and return the result', async () => {
        const transactionObject = {
            to: '0x1234',
            data: '0x5678'
        };
        const result = '0xabcdef';

        // Mock the response for the eth_call method
        mockEthMethod('eth_call', [transactionObject, 'latest'], result);

        const callResult = await client.call(transactionObject);
        expect(callResult).toEqual(result);
    });

    it('should call the getGasPrice method and return the result', async () => {
        const result = '0x1';

        // Mock the response for the eth_gasPrice method
        mockEthMethod('eth_gasPrice', [], result);

        const gasPrice = await client.getGasPrice();
        expect(gasPrice).toEqual(result);
    });

    it('should call the getLogs method and return the result', async () => {
        const filterObject = {
            fromBlock: '0x1',
            toBlock: '0x2',
            address: '0x1234',
            topics: []
        };
        const result = {
            "address": "0xde0b295669a9fd93d5f28d9ec85e40f4cb697bae",
            "blockHash": "0x827a1b2dd0c481f4b6f4f5a762dacb9c59e07bea73c635789fb5999b8267a1fa",
            "blockNumber": "0x70839",
            "data": "0x0000000000000000000000000000000000000000000000000000000000000002",
            "logIndex": "0x1a",
            "removed": false,
            "topics": ["0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef", "0x000000000000000000000000bed9c569269fdf71427246e7f974062c0e6a4a51", "0x0000000000000000000000006ca105d2ae708191a603ad6097b88e4e66ca4689"],
            "transactionHash": "0x8508c2c4b7004c24231e95a48fcb7bb02f63a3a0c630a0e4681956994e3a4a8c",
            "transactionIndex": "0x3e",
        }

        // Mock the response for the eth_getLogs method
        mockEthMethod('eth_getLogs', [filterObject], result);

        const logs = await client.getLogs(filterObject);
        expect(logs).toEqual(result);
    });

    it('should call the getNetVersion method and return the result', async () => {
        const result = '1';

        // Mock the response for the net_version method
        mockEthMethod('net_version', [], result);

        const netVersion = await client.getNetVersion();
        expect(netVersion).toEqual(result);
    });

    it('should call the sendRawTransaction method and return the result', async () => {
        const signedTxData = '0x1234';
        const result = '0x5678'; // Transaction Hash

        // Mock the response for the eth_sendRawTransaction method
        mockEthMethod('eth_sendRawTransaction', [signedTxData], result);

        const txHash = await client.sendRawTransaction(signedTxData);
        expect(txHash).toEqual(result);
    });

    it('should call the estimateGas method and return the result', async () => {
        const transactionObject = {
            from: '0x1234',
            to: '0x5678',
            value: '0x9abc'
        };
        const result = '0x1';

        // Mock the response for the eth_estimateGas method
        mockEthMethod('eth_estimateGas', [transactionObject], result);

        const gasEstimate = await client.estimateGas(transactionObject);
        expect(gasEstimate).toEqual(result);
    });

    it('should call the getMaxPriorityFeePerGas method and return the result', async () => {
        const result = '0x1';

        // Mock the response for the eth_maxPriorityFeePerGas method
        mockEthMethod('eth_maxPriorityFeePerGas', [], result);

        const maxPriorityFeePerGas = await client.getMaxPriorityFeePerGas();
        expect(maxPriorityFeePerGas).toEqual(result);
    });

    it('should call the getCode method and return the result', async () => {
        const address = '0x1234';
        const result = '0x5678';

        // Mock the response for the eth_getCode method
        mockEthMethod('eth_getCode', [address, 'latest'], result);

        const code = await client.getCode(address);
        expect(code).toEqual(result);
    });
});
