/**
 * @module provider-sdk/provider-fixtures
 * @description Mock configurations and payloads for testing.
 */

export const providerFixtures = {
  queuePayload: { job: 'test-job', data: { val: 42 } },
  lockKey: 'locks/resource-x',
  storagePayload: { content: 'test storage content' },
};
