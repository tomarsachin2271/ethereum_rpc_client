# Ethereum RPC Client

[![codecov](https://codecov.io/gh/tomarsachin2271/ethereum_rpc_client/branch/master/graph/badge.svg?token=f372a23a-11e0-42b1-a893-ce55cef70e3b)](https://codecov.io/gh/tomarsachin2271/ethereum_rpc_client)

This package is a simple package that mirrors the ethereum rpc calls using HTTP calls directly. No funny business going on inside the package, just plain RPC calls via HTTP client.

## Installation
Use the package manager [npm](https://www.npmjs.com/) to install `ethereum_rpc_client`.
```
npm install ethereum_rpc_client
```
or if you are using [yarn](https://yarnpkg.com/):

```
yarn add ethereum_rpc_client
```

## Usage
Import EthereumClient from the ethereum_rpc_client package and initialize it with your desired RPC node URLs.

Then you can write:

```javascript
import EthereumClient from 'ethereum_rpc_client';

const client = new EthereumClient({ defaultNodeUrls: ['http://localhost:8545'] });
```

Now, you can use the client to make calls to the Ethereum network. For example, to get the balance of an address, you could do something like this:

```javascript
async function main() {
    const balance = await client.getBalance('0x...');
    console.log('Balance:', balance);
}
main();
```

In this example, replace '0x...' with an actual Ethereum address.


## API
This package provides a thin wrapper over the Ethereum JSON RPC API. Here are the methods that you can use:

```javascript
// Get the balance of an address
client.getBalance(address, nodeUrl?)

// Get the transaction count (nonce) of an address
client.getTransactionCount(address, nodeUrl?)

// Get the chain id that the client is connected to
client.getChainId(nodeUrl?)

// Get the current block number
client.getBlockNumber(nodeUrl?)

// Get the receipt of a transaction
client.getTransactionReceipt(transactionHash, nodeUrl?)

// Get a block by its number
client.getBlockByNumber(blockNumber, nodeUrl?)

// Make a call to a contract
client.call(transactionObject, nodeUrl?)

// Get the current gas price
client.getGasPrice(nodeUrl?)

// Get the logs that match a filter object
client.getLogs(filterObject, nodeUrl?)

// Get the network version
client.getNetVersion(nodeUrl?)

// Send a signed transaction
client.sendRawTransaction(signedTxData, nodeUrl?)

// Estimate the gas that a transaction will use
client.estimateGas(transactionObject, nodeUrl?)

// Get the maximum priority fee per gas
client.getMaxPriorityFeePerGas(nodeUrl?)

// Get the code at a specific address
client.getCode(address, nodeUrl?)
```

For all methods, nodeUrl is optional. If not provided, the request will be made to the default nodes that were provided when the client was created.

Note that this is not an exhaustive list of all Ethereum JSON RPC methods. Additional methods can be added as needed.

## Testing
This package includes both unit and end-to-end tests, which are written using Jest. You can run the tests with the following commands:

Run unit tests
```bash
yarn test
```

Run end-to-end tests
```bash
yarn test:e2e
```

These commands will run the tests and generate coverage reports.

End-to-end tests are designed to be run against a real Ethereum node. For accurate results, provide your own node URL when running these tests.

Please make sure all tests pass before contributing to the project.

## Contributions

We welcome contributions from the community. If you wish to contribute, please follow the steps below:

Fork the repository.
Create a new branch for your feature or bug fix.
Write tests for your changes (if applicable).
Ensure all tests pass.
Submit a pull request, ensuring that it includes a clear description of the changes.
Before contributing, please read through the existing code to understand the structure and style. If you have any questions, feel free to open an issue.

Please note that all contributors are expected to follow our code of conduct.

## License
This project is licensed under the terms of the MIT license. For more information, see the [License](LICENSE) file in the project repository. Your use of the ethereum_rpc_client signifies your acceptance of the terms of the MIT license.
