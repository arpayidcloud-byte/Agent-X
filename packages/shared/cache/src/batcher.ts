export interface BatchOptions {
  maxBatchSize?: number;
  delayMs?: number;
}

export class RequestBatcher<T, R> {
  private pending: Array<{
    request: T;
    resolve: (result: R) => void;
    reject: (error: unknown) => void;
  }> = [];
  private timer: ReturnType<typeof setTimeout> | null = null;
  private maxBatchSize: number;
  private delayMs: number;
  private processor: (batch: T[]) => Promise<R[]>;

  constructor(processor: (batch: T[]) => Promise<R[]>, options: BatchOptions = {}) {
    this.processor = processor;
    this.maxBatchSize = options.maxBatchSize ?? 10;
    this.delayMs = options.delayMs ?? 50;
  }

  async add(request: T): Promise<R> {
    return new Promise<R>((resolve, reject) => {
      this.pending.push({ request, resolve, reject });

      if (this.pending.length >= this.maxBatchSize) {
        void this.flush();
      } else if (!this.timer) {
        this.timer = setTimeout(() => void this.flush(), this.delayMs);
      }
    });
  }

  private async flush(): Promise<void> {
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }

    const batch = this.pending.splice(0, this.maxBatchSize);
    if (batch.length === 0) return;

    try {
      const results = await this.processor(batch.map((b) => b.request));
      for (let i = 0; i < batch.length; i++) {
        batch[i]!.resolve(results[i]!);
      }
    } catch (error) {
      for (const item of batch) {
        item.reject(error);
      }
    }
  }
}
