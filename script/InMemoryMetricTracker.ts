/* eslint-disable no-console */
import { IMetricTracker } from "../src";
import Table from 'cli-table3';
import chalk from 'chalk';
import { urlToProvider } from "./test-performance";

type Metric = {
    method: string;
    params: any[];
    nodeUrl: string;
    responseTime: number;
    success: boolean;
    error?: Error;
};

type AverageLatency = {
    totalResponseTime: number;
    count: number;
    successCount: number;
    errorCount: number;
    average: number;
};

export class InMemoryMetricTracker implements IMetricTracker {
    private metrics: Metric[] = [];
    private averageLatencyPerMethod: Record<string, Record<string, AverageLatency>> = {};

    track(method: string, params: any[], nodeUrl: string, responseTime: number, success: boolean, error?: Error): void {
        const metric: Metric = {
            method,
            params,
            nodeUrl,
            responseTime,
            success,
            error,
        };

        this.metrics.push(metric);

        if (!this.averageLatencyPerMethod[method]) {
            this.averageLatencyPerMethod[method] = {};
        }

        if (!this.averageLatencyPerMethod[method][nodeUrl]) {
            this.averageLatencyPerMethod[method][nodeUrl] = {
                totalResponseTime: 0,
                count: 0,
                successCount: 0,
                errorCount: 0,
                average: 0
            }
        }

        this.averageLatencyPerMethod[method][nodeUrl].totalResponseTime += responseTime;
        this.averageLatencyPerMethod[method][nodeUrl].count++;
        this.averageLatencyPerMethod[method][nodeUrl].average = this.averageLatencyPerMethod[method][nodeUrl].totalResponseTime / this.averageLatencyPerMethod[method][nodeUrl].count;
        success ? this.averageLatencyPerMethod[method][nodeUrl].successCount++ : this.averageLatencyPerMethod[method][nodeUrl].errorCount++;
    }

    logMetrics(): void {
        Object.entries(this.averageLatencyPerMethod).forEach(([method, methodData]) => {
            const table = new Table({
                head: ['Provider', 'AverageLatency', 'SuccessCount', 'ErrorCount'],
                colWidths: [15, 20, 15, 15]
            });

            // Convert methodData entries to an array and sort it by AverageLatency
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const sortedMethodData = Object.entries(methodData).sort(([_, a], [__, b]) => a.average - b.average);

            sortedMethodData.forEach(([nodeUrl, averageLatency]) => {
                const providerName = urlToProvider[nodeUrl] ?? "Unknown";
                table.push([
                    chalk.cyan(providerName),
                    averageLatency.average,
                    chalk.green(`${averageLatency.successCount}/${averageLatency.count}`),
                    chalk.red(`${averageLatency.errorCount}/${averageLatency.count}`)
                ]);
            });

            console.log(`\n\nMethod: ${method}`);
            console.log(table.toString());
        });
    }


    clearMetrics(): void {
        this.metrics = [];
        this.averageLatencyPerMethod = {};
    }
}
