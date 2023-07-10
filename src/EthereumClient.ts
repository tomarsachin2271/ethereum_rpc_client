import axios, { type AxiosInstance } from 'axios'
import type IMetricTracker from './metric-tracker/interfaces/IMetricTracker'

interface EthereumClientOptions {
  defaultNodeUrls: string[]
  metricTracker?: IMetricTracker
}

class EthereumClient {
  private clients: Record<string, AxiosInstance> = {}
  private readonly defaultNodeUrls: string[]
  private idCounter: number
  private readonly metricTracker?: IMetricTracker

  constructor(options: EthereumClientOptions) {
    this.defaultNodeUrls = options.defaultNodeUrls
    this.idCounter = 1
    this.metricTracker = options.metricTracker
  }

  private getClient(nodeUrl: string): AxiosInstance {
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

  private async makeRPCRequest(method: string, params: any[] = [], nodeUrl?: string): Promise<any> {
    const urls = nodeUrl ? [nodeUrl] : this.defaultNodeUrls;
    let lastError: Error = new Error('All requests failed while calling given end points');

    for (const url of urls) {
      const client = this.getClient(url);
      const start = Date.now();
      try {
        const response = await client.post('', {
          jsonrpc: '2.0',
          id: this.idCounter++,
          method,
          params,
        });

        const responseTime = Date.now() - start;
        // Only track the metric if a metricTracker is provided
        this.metricTracker?.track(method, params, url, responseTime, !response.data.error);

        if (response.data.error) {
          throw new Error(response.data.error.message);
        }
        return response.data.result;
      } catch (error) {
        const responseTime = Date.now() - start;
        lastError = error as Error;

        // If the error is due to the server responding with a non-2xx status code,
        // log the error and continue to the next URL.
        if (axios.isAxiosError(lastError) && lastError.response && lastError.response.status !== 200) {
          this.metricTracker?.track(method, params, url, responseTime, false, lastError);
          continue;
        }

        // If the error is an application error (response.data.error), do not continue to the next URL,
        // just throw the error.
        this.metricTracker?.track(method, params, url, responseTime, false, lastError);
        throw lastError;
      }
    }

    throw lastError; // if all requests fail, throw the last error
  }

  async getBlockNumber(nodeUrl?: string) {
    return await this.makeRPCRequest('eth_blockNumber', [], nodeUrl)
  }

  async call(transactionObject: any, nodeUrl?: string) {
    return await this.makeRPCRequest('eth_call', [transactionObject, 'latest'], nodeUrl)
  }

  async getChainId(nodeUrl?: string) {
    return await this.makeRPCRequest('eth_chainId', [], nodeUrl)
  }

  async getCoinbaseAddress(nodeUrl?: string){
    return await this.makeRPCRequest('eth_coinbase', [], nodeUrl);
  }

  async getAccessList(transactionObject: any, nodeUrl?: string ) {
    return await this.makeRPCRequest('eth_createAccessList',[transactionObject,'latest'], nodeUrl)
  }

  async estimateGas(transactionObject: any, nodeUrl?: string) {
    return await this.makeRPCRequest('eth_estimateGas', [transactionObject], nodeUrl)
  }

  async getGasPrice(nodeUrl?: string) {
    return await this.makeRPCRequest('eth_gasPrice', [], nodeUrl)
  }

  async getBalance(address: string, nodeUrl?: string) {
    return await this.makeRPCRequest('eth_getBalance', [address, 'latest'], nodeUrl)
  }

  async getBlockByHash(blockHash: string, nodeUrl?: string) {
    return await this.makeRPCRequest('eth_getBlockByHash', [blockHash, true], nodeUrl)
  }

  async getBlockByNumber(blockNumber: string, nodeUrl?: string) {
    return await this.makeRPCRequest('eth_getBlockByNumber', [blockNumber, true], nodeUrl)
  }

  async getTransactionCountInBlock(blockNumber: string, blockHash: string, nodeUrl?: string){
    if(blockNumber != null){
      return await this.makeRPCRequest("eth_getBlockTransactionCountByNumber",[blockNumber], nodeUrl )
    }
    if(blockHash != null){
      return await this.makeRPCRequest("eth_getBlockTransactionCountByHash",[blockHash],nodeUrl)
    }
    return await this.makeRPCRequest("eth_getBlockTransactionCountByNumber",["latest"], nodeUrl)
  }

  async getCode(address: string, nodeUrl?: string) {
    return await this.makeRPCRequest('eth_getCode', [address, 'latest'], nodeUrl)
  }

  async getFilterChanges(filterIdentifier: string, nodeUrl?: string) {
    return await this.makeRPCRequest("eth_getFilterChanges",[filterIdentifier], nodeUrl)
  }

  async getFilterLogs(filteridentifier: string, nodeUrl?: string){
    return await this.makeRPCRequest("eth_getFilterLogs", [filteridentifier], nodeUrl)
  }  

  async getLogs(filterObject: any, nodeUrl?: string) {
    return await this.makeRPCRequest("eth_getLogs", [filterObject], nodeUrl)
  }

  // overlook
  async getProof(address: string, storageKeys: string[], nodeUrl?: string){
    return await this.makeRPCRequest("eth_getProof", [address,storageKeys,"latest"],nodeUrl)
  }

  async getStorageAt(address: string, storageSlot: string, nodeUrl?: string){
    return await this.makeRPCRequest("eth_getStorageAt",[address,storageSlot,"latest"], nodeUrl)
  }

  async getTransactionByHash(transactionHash: string, nodeUrl?: string) {
    return await this.makeRPCRequest("eth_getTransactionByHash", [transactionHash], nodeUrl)
  }

  async getTransactionReceipt(transactionHash: string, nodeUrl?: string) {
    return await this.makeRPCRequest('eth_getTransactionReceipt', [transactionHash], nodeUrl)
  }

  async getTransactionCount(address: string, nodeUrl?: string) {
    return await this.makeRPCRequest('eth_getTransactionCount', [address, 'latest'], nodeUrl)
  }

  async getMaxPriorityFeePerGas(nodeUrl?: string) {
    return await this.makeRPCRequest('eth_maxPriorityFeePerGas', [], nodeUrl)
  }

  async sendRawTransaction(signedTxData: string, nodeUrl?: string) {
    return await this.makeRPCRequest('eth_sendRawTransaction', [signedTxData], nodeUrl)
  }

  async getNetVersion(nodeUrl?: string) {
    return await this.makeRPCRequest('net_version', [], nodeUrl)
  }
  
}

export default EthereumClient
