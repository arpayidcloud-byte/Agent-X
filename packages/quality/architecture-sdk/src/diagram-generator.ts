/**
 * @module architecture-sdk/diagram-generator
 * @description Generates system architectures and package graphs.
 */

export class DiagramGenerator {
  generateUML(): string {
    return '@startuml\nactor Client\nClient -> Facade\n@enduml\n';
  }
}
