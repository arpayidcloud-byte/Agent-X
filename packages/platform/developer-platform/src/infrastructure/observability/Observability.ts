import { createHash } from 'crypto';

export interface DashboardEntry {
  readonly dashboardId: string;
  readonly name: string;
  readonly type: string;
  readonly widgets: readonly string[];
  readonly checksum: string;
}

export class DashboardManager {
  private dashboards = new Map<string, DashboardEntry>();

  create(name: string, type: string, widgets: string[] = []): DashboardEntry {
    const dashboardId = `db-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
    const checksum = createHash('sha256')
      .update(JSON.stringify({ dashboardId, name, type, widgets }))
      .digest('hex');
    const entry: DashboardEntry = Object.freeze({
      dashboardId,
      name,
      type,
      widgets: [...widgets],
      checksum,
    });
    this.dashboards.set(dashboardId, entry);
    return entry;
  }

  get(dashboardId: string): DashboardEntry | undefined {
    return this.dashboards.get(dashboardId);
  }

  getAll(): DashboardEntry[] {
    return Array.from(this.dashboards.values());
  }
}

export interface ReportTemplate {
  readonly templateId: string;
  readonly name: string;
  readonly format: string;
  readonly checksum: string;
}

export class ReportTemplateManager {
  private templates = new Map<string, ReportTemplate>();

  create(name: string, format: string): ReportTemplate {
    const templateId = `rt-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
    const checksum = createHash('sha256')
      .update(JSON.stringify({ templateId, name, format }))
      .digest('hex');
    const template: ReportTemplate = Object.freeze({ templateId, name, format, checksum });
    this.templates.set(templateId, template);
    return template;
  }

  get(templateId: string): ReportTemplate | undefined {
    return this.templates.get(templateId);
  }

  getAll(): ReportTemplate[] {
    return Array.from(this.templates.values());
  }
}

export interface MetricSummary {
  readonly summaryId: string;
  readonly metric: string;
  readonly value: number;
  readonly timestamp: Date;
  readonly checksum: string;
}

export class MetricSummarizer {
  private summaries: MetricSummary[] = [];

  record(metric: string, value: number): MetricSummary {
    const summaryId = `ms-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
    const checksum = createHash('sha256')
      .update(JSON.stringify({ summaryId, metric, value }))
      .digest('hex');
    const summary: MetricSummary = Object.freeze({
      summaryId,
      metric,
      value,
      timestamp: new Date(),
      checksum,
    });
    this.summaries.push(summary);
    return summary;
  }

  query(metric: string): MetricSummary[] {
    return this.summaries.filter((s) => s.metric === metric);
  }

  getAll(): MetricSummary[] {
    return [...this.summaries];
  }
}
