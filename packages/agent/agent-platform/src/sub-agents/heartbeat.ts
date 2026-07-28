import type { SubAgentHeartbeat } from './interfaces.js';
import { AgentHeartbeatLostError } from './errors.js';
import { EventEmitter } from 'events';

export class HeartbeatMonitor extends EventEmitter {
  private lastHeartbeats = new Map<string, SubAgentHeartbeat>();
  private readonly timeoutMs: number;
  private intervalId?: NodeJS.Timeout;

  constructor(timeoutMs: number = 30000) {
    super();
    this.timeoutMs = timeoutMs;
  }

  public recordHeartbeat(heartbeat: SubAgentHeartbeat): void {
    this.lastHeartbeats.set(heartbeat.agentId, heartbeat);
  }

  public startMonitoring(checkIntervalMs: number = 5000): void {
    this.intervalId = setInterval(() => {
      this.checkHeartbeats();
    }, checkIntervalMs);
  }

  public stopMonitoring(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = undefined;
    }
  }

  private checkHeartbeats(): void {
    const now = Date.now();
    for (const [agentId, heartbeat] of this.lastHeartbeats.entries() as Iterable<
      [string, SubAgentHeartbeat]
    >) {
      if (now - heartbeat.timestamp.getTime() > this.timeoutMs) {
        this.emit('heartbeat_lost', new AgentHeartbeatLostError(agentId as string));
        this.lastHeartbeats.delete(agentId as string); // Prevent repeated events
      }
    }
  }

  public getStatus(agentId: string): SubAgentHeartbeat | undefined {
    return this.lastHeartbeats.get(agentId);
  }
}
