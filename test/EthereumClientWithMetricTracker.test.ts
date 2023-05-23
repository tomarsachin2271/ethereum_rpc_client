import { EthereumClient, IMetricTracker } from '../src';
import axios from 'axios';

jest.mock('axios');

// This sets the mock adapter on the default instance
var mock = axios as jest.Mocked<typeof axios>;
mock.create = jest.fn(() => mock);

// Create a mock MetricTracker
const mockMetricTracker: IMetricTracker = {
    track: jest.fn(),
};

// Initialize the EthereumClient with a default node URL and the mock MetricTracker
const client = new EthereumClient({ defaultNodeUrl: 'http://localhost:8545', metricTracker: mockMetricTracker });

// helper function to mock an Ethereum RPC method
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

describe('EthereumClient method tests with MetricTracker', () => {

    afterEach(() => jest.clearAllMocks());

    // test getBalance
    it('should call the getBalance method, return the result, and track the call', async () => {
        const address = '0x1234';
        const result = '0x5678';

        // Mock the response for the eth_getBalance method
        mockEthMethod('eth_getBalance', [address, 'latest'], result);

        const balance = await client.getBalance(address);

        expect(balance).toEqual(result);
        expect(mockMetricTracker.track).toHaveBeenCalledWith('eth_getBalance', [address, 'latest'], 'http://localhost:8545', expect.any(Number), true, undefined);
    });

    // test getBalance error handling
    it('should throw an error when getBalance fails due to an RPC error and track the error', async () => {
        const address = '0x1234';
        const errorMessage = 'RPC error';

        // Mock an error response for the eth_getBalance method
        mockEthMethod('eth_getBalance', [address, 'latest'], undefined, errorMessage);

        // Assert that calling getBalance throws an error
        await expect(client.getBalance(address)).rejects.toThrow(errorMessage);
        expect(mockMetricTracker.track).toHaveBeenCalledWith('eth_getBalance', [address, 'latest'], 'http://localhost:8545', expect.any(Number), false, new Error(errorMessage));
    });


});
