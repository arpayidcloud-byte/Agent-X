import { describe, it, expect } from 'vitest';
import { RuleTester } from 'eslint';

const plugin = require('../index.js');

describe('eslint-plugin-internal', () => {
  describe('no-credential-logging rule', () => {
    it('is defined', () => {
      expect(plugin.rules['no-credential-logging']).toBeDefined();
      expect(plugin.rules['no-credential-logging'].meta.type).toBe('problem');
    });

    it('has a create function', () => {
      expect(typeof plugin.rules['no-credential-logging'].create).toBe('function');
    });
  });

  describe('no-secret-prefix-logging rule', () => {
    it('is defined', () => {
      expect(plugin.rules['no-secret-prefix-logging']).toBeDefined();
      expect(plugin.rules['no-secret-prefix-logging'].meta.type).toBe('problem');
    });
  });

  describe('no-vendor-sdk-import rule', () => {
    it('is defined', () => {
      expect(plugin.rules['no-vendor-sdk-import']).toBeDefined();
      expect(plugin.rules['no-vendor-sdk-import'].meta.type).toBe('problem');
    });
  });

  describe('plugin exports', () => {
    it('exports all 3 rules', () => {
      const ruleNames = Object.keys(plugin.rules);
      expect(ruleNames).toContain('no-credential-logging');
      expect(ruleNames).toContain('no-secret-prefix-logging');
      expect(ruleNames).toContain('no-vendor-sdk-import');
      expect(ruleNames).toHaveLength(3);
    });
  });
});
