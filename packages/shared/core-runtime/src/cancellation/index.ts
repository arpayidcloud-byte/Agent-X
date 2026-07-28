export interface ICancellationToken {
  readonly signal: AbortSignal;
  readonly reason: string;
  readonly isCancelled: boolean;

  cancel(reason: string): void;
  checkCancellation(): void;
  fork(): ICancellationToken;
}

export class CancellationToken implements ICancellationToken {
  private abortController: AbortController;
  private _reason: string = '';

  constructor() {
    this.abortController = new AbortController();
  }

  public get signal(): AbortSignal {
    return this.abortController.signal;
  }

  public get reason(): string {
    return this._reason;
  }

  public get isCancelled(): boolean {
    return this.abortController.signal.aborted;
  }

  public cancel(reason: string): void {
    this._reason = reason;
    this.abortController.abort(new Error(reason));
  }

  public checkCancellation(): void {
    if (this.isCancelled) {
      throw new Error(`Operation cancelled: ${this._reason}`);
    }
  }

  public fork(): ICancellationToken {
    const child = new CancellationToken();
    this.signal.addEventListener('abort', () => {
      child.cancel(`Parent cancelled: ${this._reason}`);
    });
    return child;
  }
}

export class CancellationSource {
  private _token: CancellationToken;

  constructor() {
    this._token = new CancellationToken();
  }

  public get token(): ICancellationToken {
    return this._token;
  }

  public cancel(reason: string): void {
    this._token.cancel(reason);
  }
}
