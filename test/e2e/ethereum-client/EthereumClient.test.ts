import { EthereumClient } from "../../../src";
import networkConfig from "./networkConfig";

const testAddress = '0x229F701345b239c9C0a0685ef32e34842eDd1a45';
// truncated non-20 bytes string
const invalidTestAddress = '0x229F701345b239c9C0a0685ef32e34842';

describe('EthereumClient E2E tests', () => {
    networkConfig.forEach(({ nodeUrls }) => {
        describe(`EthereumClient E2E tests for ${nodeUrls}`, () => {
            const client = new EthereumClient({ defaultNodeUrls: nodeUrls });

            it('should call the getBalance method and return the result', async () => {
                const address = testAddress;

                const balance = await client.getBalance(address);
                expect(typeof balance).toBe('string');
            });

            it('should throw an error when getBalance method is provided with an invalid address', async()=>{
                const address = invalidTestAddress;
                await expect(client.getBalance(invalidTestAddress)).rejects.toThrow(Error);
            });

            it('should call the getTransactionCount method and return the result', async()=>{
                const address = testAddress;
                const txsCount = await client.getTransactionCount(address);
                expect(typeof txsCount).toBe('string');
            });

            it('should throw an error when getTransactionCount method is provided with an invalid address', async()=>{
                const address = invalidTestAddress;
                await expect(client.getTransactionCount(address)).rejects.toThrow(Error);
            })

            // Add more tests as needed
        });

    });
});