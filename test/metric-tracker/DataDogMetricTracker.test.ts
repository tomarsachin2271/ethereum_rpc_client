import { StatsD } from 'hot-shots';
import DataDogMetricTracker, { DataDogOptions } from '../../src/metric-tracker/datadog/DataDogMetricTracker';
import IMetricTracker from '../../src/metric-tracker/interfaces/IMetricTracker';

jest.mock('hot-shots');

describe('DataDogMetricTracker', () => {
    let dataDogMetricTracker: IMetricTracker;
    let dataDogOptions: DataDogOptions;
    let mockStatsD: jest.MockedClass<typeof StatsD>;

    beforeEach(() => {
        dataDogOptions = {
            host: 'localhost',
            port: 8125,
            prefix: 'prefix.',
            latencyMetric: 'latency.metric',
            countMetric: 'count.metric',
            errorMetric: 'error.metric',
        };
        // Mock the StatsD methods we're interested in
        mockStatsD = StatsD as jest.MockedClass<typeof StatsD>;
        mockStatsD.prototype.timing = jest.fn();
        mockStatsD.prototype.increment = jest.fn();
        dataDogMetricTracker = new DataDogMetricTracker(dataDogOptions);
    });

    afterEach(() => {
        // Clear the mocks after each test
        (mockStatsD.prototype.timing as jest.Mock).mockClear();
        (mockStatsD.prototype.increment as jest.Mock).mockClear();
    });

    it('should track metrics', () => {
        const method = 'eth_getBalance';
        const params = ['0x1234', 'latest'];
        const nodeUrl = 'http://localhost:8545';
        const responseTime = 1234;
        const success = true;

        dataDogMetricTracker.track(method, params, nodeUrl, responseTime, success);

        const tags = [`method:${method}`, `nodeUrl:${nodeUrl}`, `success:${success.toString()}`];
        expect(mockStatsD.prototype.timing).toHaveBeenCalledWith(dataDogOptions.latencyMetric, responseTime, tags);
        expect(mockStatsD.prototype.increment).toHaveBeenCalledWith(dataDogOptions.countMetric, tags);
    });

    it('should track metrics with error', async () => {
        const method = 'eth_getBalance';
        const params = ['0x1234', 'latest'];
        const nodeUrl = 'http://localhost:8545';
        const responseTime = 1234;
        const success = false;
        const error = new Error('RPC error');

        await dataDogMetricTracker.track(method, params, nodeUrl, responseTime, success, error);

        const tags = [`method:${method}`, `nodeUrl:${nodeUrl}`, `success:${success.toString()}`, `error:${error.name}`];
        expect(mockStatsD.prototype.timing).toHaveBeenCalledWith(dataDogOptions.latencyMetric, responseTime, tags);
        expect(mockStatsD.prototype.increment).toHaveBeenCalledWith(dataDogOptions.countMetric, tags);
        expect(mockStatsD.prototype.increment).toHaveBeenCalledWith(dataDogOptions.errorMetric, 1, tags);
    });

    it('should use default metric names when they are not provided', async () => {
        const dataDogOptions: DataDogOptions = {
            host: 'localhost',
            port: 8125,
            prefix: 'prefix.',
        };

        dataDogMetricTracker = new DataDogMetricTracker(dataDogOptions);

        const method = 'eth_getBalance';
        const params = ['0x1234', 'latest'];
        const nodeUrl = 'http://localhost:8545';
        const responseTime = 1234;
        const success = true;

        await dataDogMetricTracker.track(method, params, nodeUrl, responseTime, success);

        const tags = [`method:${method}`, `nodeUrl:${nodeUrl}`, `success:${success.toString()}`];
        expect(mockStatsD.prototype.timing).toHaveBeenCalledWith('ethereum_rpc.latency', responseTime, tags);
        expect(mockStatsD.prototype.increment).toHaveBeenCalledWith('ethereum_rpc.count', tags);
    });

});
