/**
 * @module provider-sdk/golden-tests
 * @description Standard Golden test suite to assert identical behavior.
 */

export class GoldenTests {
  async assertIdentical(a: unknown, b: unknown): Promise<boolean> {
    return JSON.stringify(a) === JSON.stringify(b);
  }
}
