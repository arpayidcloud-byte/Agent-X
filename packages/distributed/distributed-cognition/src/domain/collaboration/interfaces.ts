/** Collaboration domain interfaces. */

export type CollaborationState =
  'INITIATED' | 'NEGOTIATING' | 'EXECUTING' | 'SYNTHESIZING' | 'COMPLETED' | 'FAILED';

export interface CrossNodeSession {
  readonly sessionId: string;
  readonly initiatorNode: string;
  readonly participants: readonly string[];
  readonly state: CollaborationState;
  readonly goalId: string;
  readonly checksum: string;
  readonly createdAt: Date;
}

export interface CollaborationMessage {
  readonly messageId: string;
  readonly fromNode: string;
  readonly toNode: string;
  readonly type: 'PROPOSAL' | 'VOTE' | 'DECISION' | 'HEARTBEAT' | 'CANCEL';
  readonly payload: Record<string, unknown>;
  readonly timestamp: Date;
  readonly checksum: string;
}
