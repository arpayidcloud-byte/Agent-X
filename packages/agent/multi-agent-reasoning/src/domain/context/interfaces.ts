/**
 * @module multi-agent-reasoning/domain/context/interfaces
 * @description Context domain interfaces.
 */

export interface SharedContext {
  sessionId: string;
  data: Record<string, unknown>;
  version: number;
  checksum: string;
}
