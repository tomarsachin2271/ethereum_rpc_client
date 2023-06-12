import { EthereumClient } from "../../../src";
import {networkConfig, uniswapNetworkConfig} from "./networkConfig";

const testAddress = '0x229F701345b239c9C0a0685ef32e34842eDd1a45';
// truncated non-20 bytes string
const invalidTestAddress = '0x229F701345b239c9C0a0685ef32e34842';
// UniV3Factory.sol deployed address across {Mainnet, Goerli, Arbitrum, Optimism, Polygon}
const univ3factoryAddress = '0x1F98431c8aD98523631AE4a59f267346ea31F984';
// Externally Owned Account address
const EOAaddress = '0x1fD3Acf96F8B14994Fb912e2330641884dA00D6E';

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
            });

            it('should call the getGasPrice method and return the result', async() =>{
                const gasPrice = await client.getGasPrice();
                expect(typeof gasPrice).toBe('string');
                const numGasPrice = parseInt(gasPrice,16);
                expect(numGasPrice).toBeGreaterThanOrEqual(0);
            })

            it('should call the getMaxPriorityFeePerGas method and return the result', async()=>{
                const maxPriorityFeePerGas = await client.getMaxPriorityFeePerGas();
                expect(typeof maxPriorityFeePerGas).toBe('string');
                const numMaxPriorityFeePerGas = parseInt(maxPriorityFeePerGas,16);
                expect(numMaxPriorityFeePerGas).toBeGreaterThanOrEqual(0);
            })

            // Add more tests as needed
        });

    });
    uniswapNetworkConfig.forEach(({ nodeUrls })=>{
        describe(`Ethereum E2E state tests for ${nodeUrls}`,()=>{
            const client = new EthereumClient({defaultNodeUrls: nodeUrls});

            it('should call the getCode method and return the result', async()=>{
                const address = univ3factoryAddress;
                const code = await client.getCode(address);
                expect(typeof code).toBe('string');
                expect(code.length).toBeGreaterThan(0);
            });

            it('should call the getCode method and return 0x for EOA address', async()=>{
                const address = EOAaddress;
                const code = await client.getCode(address);
                const expected = '0x';
                expect(code).toBe(expected);
            });

            it('should call the getCode method and return error for invalid non 20 byte address', async()=>{
                const address = invalidTestAddress;
                await expect(client.getCode(address)).rejects.toThrow(Error);
            });


        })
    })
});