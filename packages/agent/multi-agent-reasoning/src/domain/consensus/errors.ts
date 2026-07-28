/**
 * @module multi-agent-reasoning/domain/consensus/errors
 * @description Consensus protocol domain errors.
 */

export class ConsensusProtocolError extends Error {
  public readonly code: string;
  public readonly source: string;

  constructor(message: string, code: string, source: string) {
    super(message);
    this.name = 'ConsensusProtocolError';
    this.code = code;
    this.source = source;
  }
}
