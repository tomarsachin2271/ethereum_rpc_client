export default interface IMetricTracker {
    track(method: string, params: any[], nodeUrl: string, responseTime: number, success: boolean, error?: Error): void;
}