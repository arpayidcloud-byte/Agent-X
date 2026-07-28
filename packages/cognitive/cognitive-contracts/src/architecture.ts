/**
 * @module cognitive-contracts/architecture
 * @description Architecture validation stubs for cognitive integrations.
 */

export class CognitiveArchitectureValidator {
  validateArchitectureDirection(importedPkg: string, targetPkg: string): boolean {
    // Enforce Hexagonal Architecture: cognitive ports MUST NOT depend on vendor concrete providers
    if (importedPkg === 'cognitive-contracts' && targetPkg === 'native-providers') {
      return false;
    }
    return true;
  }
}
