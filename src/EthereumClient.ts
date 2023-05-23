import axios, { AxiosInstance } from 'axios';
import IMetricTracker from './metric-tracker/interfaces/IMetricTracker';

interface EthereumClientOptions {
    defaultNodeUrl: string;
    metricTracker?: IMetricTracker;
}
  
class EthereumClient {
  private clients: { [nodeUrl: string]: AxiosInstance } = {};
  private defaultNodeUrl: string;
  private idCounter: number;
  private metricTracker?: IMetricTracker;

  constructor(options: EthereumClientOptions) {
    this.defaultNodeUrl = options.defaultNodeUrl;
    this.idCounter = 1;
    this.metricTracker = options.metricTracker;
  }

  private getClient(nodeUrl?: string): AxiosInstance {
    nodeUrl = nodeUrl || this.defaultNodeUrl;

    // If a client for this URL has not been created yet, create and cache one.
    if (!this.clients[nodeUrl]) {
      this.clients[nodeUrl] = axios.create({
        baseURL: nodeUrl,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }

    return this.clients[nodeUrl];
  }

  private async makeRPCRequest(method: string, params: any[] = [], nodeUrl?: string) {
    const client = this.getClient(nodeUrl);
    const start = Date.now();
    let errorObject: Error | undefined;
    try {
      const response = await client.post('', {
        jsonrpc: '2.0',
        id: this.idCounter++,
        method,
        params,
      });
      
      const responseTime = Date.now() - start;

      // Only track the metric if a metricTracker is provided
      this.metricTracker?.track(method, params, nodeUrl || this.defaultNodeUrl, responseTime, !response.data.error, errorObject);

      if (response.data.error) {
        throw new Error(response.data.error.message);
      }

      return response.data.result;
    } catch (error) {
      const responseTime = Date.now() - start;
      errorObject = error as Error;
      // Only track the metric if a metricTracker is provided
      this.metricTracker?.track(method, params, nodeUrl || this.defaultNodeUrl, responseTime, false, errorObject);
      throw error;
    }
  }

  async getBalance(address: string, nodeUrl?: string) {
    return this.makeRPCRequest('eth_getBalance', [address, 'latest'], nodeUrl);
  }

  async getTransactionCount(address: string, nodeUrl?: string) {
    return this.makeRPCRequest('eth_getTransactionCount', [address, 'latest'], nodeUrl);
  }

  async getChainId(nodeUrl?: string) {
    return this.makeRPCRequest('eth_chainId', [], nodeUrl);
  }

  async getBlockNumber(nodeUrl?: string) {
    return this.makeRPCRequest('eth_blockNumber', [], nodeUrl);
  }

  async getTransactionReceipt(transactionHash: string, nodeUrl?: string) {
    return this.makeRPCRequest('eth_getTransactionReceipt', [transactionHash], nodeUrl);
  }

  async getBlockByNumber(blockNumber: string, nodeUrl?: string) {
    return this.makeRPCRequest('eth_getBlockByNumber', [blockNumber, true], nodeUrl);
  }

  async call(transactionObject: any, nodeUrl?: string) {
    return this.makeRPCRequest('eth_call', [transactionObject, 'latest'], nodeUrl);
  }

  async getGasPrice(nodeUrl?: string) {
    return this.makeRPCRequest('eth_gasPrice', [], nodeUrl);
  }

  async getLogs(filterObject: any, nodeUrl?: string) {
    return this.makeRPCRequest('eth_getLogs', [filterObject], nodeUrl);
  }

  async getNetVersion(nodeUrl?: string) {
    return this.makeRPCRequest('net_version', [], nodeUrl);
  }

  async sendRawTransaction(signedTxData: string, nodeUrl?: string) {
    return this.makeRPCRequest('eth_sendRawTransaction', [signedTxData], nodeUrl);
  }

  async estimateGas(transactionObject: any, nodeUrl?: string) {
    return this.makeRPCRequest('eth_estimateGas', [transactionObject], nodeUrl);
  }

  async getMaxPriorityFeePerGas(nodeUrl?: string) {
    return this.makeRPCRequest('eth_maxPriorityFeePerGas', [], nodeUrl);
  }

  async getCode(address: string, nodeUrl?: string) {
    return this.makeRPCRequest('eth_getCode', [address, 'latest'], nodeUrl);
  }

  // Add more methods as needed...
}

export default EthereumClient;
