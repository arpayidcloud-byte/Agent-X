export interface MetricPoint {
  readonly name: string;
  readonly value: number;
  readonly nodeId: string;
  readonly timestamp: Date;
  readonly tags: Readonly<Record<string, string>>;
}

export class DistributedMetricsCollector {
  private metrics: MetricPoint[] = [];

  record(
    name: string,
    value: number,
    nodeId: string,
    tags: Record<string, string> = {},
  ): MetricPoint {
    const point: MetricPoint = Object.freeze({
      name,
      value,
      nodeId,
      timestamp: new Date(),
      tags: { ...tags },
    });
    this.metrics.push(point);
    return point;
  }

  query(name: string, nodeId?: string): MetricPoint[] {
    return this.metrics.filter((m) => m.name === name && (!nodeId || m.nodeId === nodeId));
  }

  aggregate(
    name: string,
    nodeId: string,
  ): { sum: number; count: number; avg: number; max: number; min: number } {
    const points = this.query(name, nodeId);
    if (points.length === 0) return { sum: 0, count: 0, avg: 0, max: 0, min: 0 };
    const values = points.map((p) => p.value);
    const sum = values.reduce((a, b) => a + b, 0);
    return {
      sum,
      count: values.length,
      avg: sum / values.length,
      max: Math.max(...values),
      min: Math.min(...values),
    };
  }

  getAll(): MetricPoint[] {
    return [...this.metrics];
  }

  clear(): void {
    this.metrics = [];
  }
}
