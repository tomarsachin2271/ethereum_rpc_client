import type IMetricTracker from '../interfaces/IMetricTracker'
import { StatsD } from 'hot-shots'

export interface DataDogOptions {
  host?: string
  port?: number
  prefix?: string
  latencyMetric?: string
  countMetric?: string
  errorMetric?: string
}

/**
 * Class that sends metrics to datadog for tracking purpose. This package assumes you have
 * already configured the Datadog agent to collect and forward metrics to Datadog.
 * It accepts DataDogOptions object in constructor.
 *
 * Here's what each option does:
 * host: The host name or IP address of the DogStatsD server. If not set, it will use the DD_AGENT_HOST environment variable if set, otherwise it will default to localhost.
 * port: The port number for the DogStatsD server. If not set, it will use the DD_DOGSTATSD_PORT environment variable if set, otherwise it will default to 8125.
 * prefix: A string to prepend to all metric names.
 * latencyMetric: Metric name used to track latnecy of Http RPC Call. If not set, ethereum_rpc.latency is used.
 * countMetric: Metric name used to track count of Http RPC Call. If not set, ethereum_rpc.count is used.
 * errorMetric: Metric name used to track count error count of Http RPC Call. If not set, ethereum_rpc.errors is used.
 */
export default class DatadogMetricTracker implements IMetricTracker {
  private readonly client: StatsD

  private readonly latencyMetric: string
  private readonly countMetric: string
  private readonly errorMetric: string

  constructor(datadogOptions: DataDogOptions) {
    this.client = new StatsD(datadogOptions)
    this.latencyMetric = datadogOptions.latencyMetric || 'ethereum_rpc.latency'
    this.countMetric = datadogOptions.countMetric || 'ethereum_rpc.count'
    this.errorMetric = datadogOptions.errorMetric || 'ethereum_rpc.errors'
  }

  async track(method: string, params: any[], nodeUrl: string, responseTime: number, success: boolean, error?: Error): Promise<void> {
    await new Promise<void>((resolve) => {
      const tags = [
        `method:${method}`,
        `nodeUrl:${nodeUrl}`,
        `success:${success}`
      ]

      this.client.timing(this.latencyMetric, responseTime, tags)
      this.client.increment(this.countMetric, tags)

      if (error != null) {
        tags.push(`error:${error.name}`)
        this.client.increment(this.errorMetric, 1, tags)
      }

      resolve()
    })
  }
}
