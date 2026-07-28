export interface IMetrics {
  counter(name: string, value: number, labels?: Record<string, string>): void;
  histogram(name: string, value: number, labels?: Record<string, string>): void;
  gauge(name: string, value: number, labels?: Record<string, string>): void;
}

export class Metrics implements IMetrics {
  private counters: Map<string, number> = new Map();
  private histograms: Map<string, number[]> = new Map();
  private gauges: Map<string, number> = new Map();

  counter(name: string, value: number, labels?: Record<string, string>): void {
    const key = this.getKey(name, labels);
    this.counters.set(key, (this.counters.get(key) || 0) + value);
  }

  histogram(name: string, value: number, labels?: Record<string, string>): void {
    const key = this.getKey(name, labels);
    if (!this.histograms.has(key)) {
      this.histograms.set(key, []);
    }
    this.histograms.get(key)!.push(value);
  }

  gauge(name: string, value: number, labels?: Record<string, string>): void {
    const key = this.getKey(name, labels);
    this.gauges.set(key, value);
  }

  private getKey(name: string, labels?: Record<string, string>): string {
    if (!labels) return name;
    const labelStr = Object.entries(labels)
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([k, v]) => `${k}=${v}`)
      .join(',');
    return `${name}{${labelStr}}`;
  }

  getCounterValue(name: string, labels?: Record<string, string>): number {
    return this.counters.get(this.getKey(name, labels)) || 0;
  }

  getHistogramValues(name: string, labels?: Record<string, string>): number[] {
    return this.histograms.get(this.getKey(name, labels)) || [];
  }

  getGaugeValue(name: string, labels?: Record<string, string>): number {
    return this.gauges.get(this.getKey(name, labels)) || 0;
  }
}
