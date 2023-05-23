import { EthereumClient } from "../../../src";
import networkConfig from "./networkConfig";

const testAddress = '0x229F701345b239c9C0a0685ef32e34842eDd1a45';

describe('EthereumClient E2E tests', () => {
    networkConfig.forEach(({ nodeUrl }) => {
        describe(`EthereumClient E2E tests for ${nodeUrl}`, () => {
            const client = new EthereumClient({ defaultNodeUrl: nodeUrl });

            it('should call the getBalance method and return the result', async () => {
                const address = testAddress;

                const balance = await client.getBalance(address);
                expect(typeof balance).toBe('string');
            });

            // Add more tests as needed
        });
    });
});