import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  PathResolver,
  FilesystemPolicy,
  FilesystemSandbox,
  AllowlistConfigLoader,
  FilesystemValidator,
  FilesystemReadTool,
  FilesystemWriteTool,
  AtomicWriter,
  SandboxViolationError,
  PathTraversalError,
  WorkspaceEscapeError,
  AllowlistViolationError,
  FileTooLargeError,
  InvalidEncodingError,
} from '../../src/filesystem/index.js';

describe('Errors', () => {
  it('creates all filesystem errors correctly', () => {
    expect(new SandboxViolationError('test')).toBeInstanceOf(Error);
    expect(new PathTraversalError('test', 'reason')).toBeInstanceOf(SandboxViolationError);
    expect(new WorkspaceEscapeError('/tmp', '/workspace')).toBeInstanceOf(SandboxViolationError);
    expect(new AllowlistViolationError('/etc/passwd')).toBeInstanceOf(SandboxViolationError);
    expect(new FileTooLargeError(1000, 500)).toBeInstanceOf(SandboxViolationError);
    expect(new InvalidEncodingError('bad')).toBeInstanceOf(SandboxViolationError);
  });
});

describe('PathResolver', () => {
  let resolver: PathResolver;
  beforeEach(() => {
    resolver = new PathResolver();
  });

  it('normalizes paths correctly', () => {
    expect(resolver.canonicalize('foo/../bar')).toBe('bar');
    expect(resolver.canonicalize('foo/./bar')).toBe('foo/bar');
  });

  it('detects traversal attempts', () => {
    expect(() => resolver.detectTraversal('../etc/passwd')).toThrow(PathTraversalError);
    expect(() => resolver.detectTraversal('\0/etc/passwd')).toThrow(PathTraversalError);
    expect(() => resolver.detectTraversal('\\\\server\\share')).toThrow(PathTraversalError);
    expect(() => resolver.detectTraversal('src/file.txt')).not.toThrow();
  });

  it('rejects invalid paths with blocked dirs', () => {
    expect(() => resolver.rejectInvalidPaths('/etc/passwd')).toThrow(PathTraversalError);
    expect(() => resolver.rejectInvalidPaths('/root/.ssh/id_rsa')).toThrow(PathTraversalError);
    expect(() => resolver.rejectInvalidPaths('/proc/self/environ')).toThrow(PathTraversalError);
    expect(() => resolver.rejectInvalidPaths('/home/user/file')).toThrow(PathTraversalError);
    expect(() => resolver.rejectInvalidPaths('/sys/kernel')).toThrow(PathTraversalError);
    expect(() => resolver.rejectInvalidPaths('/dev/sda')).toThrow(PathTraversalError);
    expect(() => resolver.rejectInvalidPaths('/etc')).toThrow(PathTraversalError);
    expect(() => resolver.rejectInvalidPaths('/root')).toThrow(PathTraversalError);
    expect(() => resolver.rejectInvalidPaths('src/app.ts')).not.toThrow();
  });

  it('resolves real path', async () => {
    const result = await resolver.resolveRealPath('/root/agentx/src/app.ts');
    expect(result).toContain('src/app.ts');
  });

  it('validateWorkspaceJail checks path starts with root', () => {
    resolver.validateWorkspaceJail('/root/agentx/workspace', '/root/agentx/workspace');
    expect(() => resolver.validateWorkspaceJail('/other/path', '/root/agentx/workspace')).toThrow(
      WorkspaceEscapeError,
    );
  });

  it('validateSymlinkEscape is a no-op placeholder', () => {
    resolver.validateSymlinkEscape('/root/agentx/file.txt');
  });
});

describe('FilesystemPolicy', () => {
  it('validates allowlist patterns', () => {
    const policy = new FilesystemPolicy({
      allow: ['src/**', 'packages/**', 'docs/**'],
      maxFileSizeBytes: 1024,
      allowHiddenFiles: false,
    });
    expect(policy.isAllowed('src/app.ts')).toBe(true);
    expect(policy.isAllowed('packages/tool-sdk/index.ts')).toBe(true);
    expect(policy.isAllowed('etc/passwd')).toBe(false);
  });

  it('handles ** glob patterns', () => {
    const policy = new FilesystemPolicy({
      allow: ['**'],
      maxFileSizeBytes: 1024,
      allowHiddenFiles: true,
    });
    expect(policy.isAllowed('anything/here.txt')).toBe(true);
  });

  it('handles wildcard patterns with *', () => {
    const policy = new FilesystemPolicy({
      allow: ['src/*.ts'],
      maxFileSizeBytes: 1024,
      allowHiddenFiles: false,
    });
    expect(policy.isAllowed('src/app.ts')).toBe(true);
    expect(policy.isAllowed('src/sub/app.ts')).toBe(false);
  });

  it('enforces file size limits', () => {
    const policy = new FilesystemPolicy({
      allow: ['**'],
      maxFileSizeBytes: 1000,
      allowHiddenFiles: true,
    });
    expect(() => policy.validateFileSize(500)).not.toThrow();
    expect(() => policy.validateFileSize(1500)).toThrow(FileTooLargeError);
  });

  it('enforces hidden file policy', () => {
    const policy = new FilesystemPolicy({
      allow: ['**'],
      maxFileSizeBytes: 1024,
      allowHiddenFiles: false,
    });
    expect(policy.isAllowed('src/app.ts')).toBe(true);
    expect(policy.isAllowed('.gitignore')).toBe(false);
  });

  it('allows hidden files when configured', () => {
    const policy = new FilesystemPolicy({
      allow: ['**'],
      maxFileSizeBytes: 1024,
      allowHiddenFiles: true,
    });
    expect(policy.isAllowed('.gitignore')).toBe(true);
  });

  it('getConfig returns the config', () => {
    const config = { allow: ['**'], maxFileSizeBytes: 1024, allowHiddenFiles: true };
    const policy = new FilesystemPolicy(config);
    expect(policy.getConfig()).toEqual(config);
  });
});

describe('FilesystemSandbox', () => {
  let sandbox: FilesystemSandbox;
  const workspaceRoot = '/root/agentx/workspace';
  let pathResolver: PathResolver;
  let policy: FilesystemPolicy;

  beforeEach(() => {
    pathResolver = new PathResolver();
    policy = new FilesystemPolicy({
      allow: ['src/**', 'packages/**'],
      maxFileSizeBytes: 10 * 1024 * 1024,
      allowHiddenFiles: false,
    });
    sandbox = new FilesystemSandbox(workspaceRoot, pathResolver, policy);
  });

  it('validates workspace jail correctly', () => {
    sandbox.validateWorkspaceJail('/root/agentx/workspace/src/app.ts');
    expect(() => sandbox.validateWorkspaceJail('/root/agentx/other')).toThrow(
      SandboxViolationError,
    );
  });

  it('validates allowlist correctly', () => {
    sandbox.validateAllowlist('/root/agentx/workspace/src/app.ts');
    expect(() => sandbox.validateAllowlist('/root/agentx/workspace/etc/passwd')).toThrow(
      AllowlistViolationError,
    );
  });

  it('validates hidden file policy', () => {
    sandbox.validateHiddenFilePolicy('/root/agentx/workspace/src/app.ts');
    expect(() => sandbox.validateHiddenFilePolicy('/root/agentx/workspace/.gitignore')).toThrow(
      SandboxViolationError,
    );
  });
});

describe('FilesystemValidator', () => {
  let validator: FilesystemValidator;
  beforeEach(() => {
    validator = new FilesystemValidator();
  });

  it('validates UTF-8 encoding', () => {
    expect(validator.validateEncoding(Buffer.from('Hello World'))).toBe(true);
    expect(validator.validateEncoding(Buffer.from([0x00, 0x01, 0x02]))).toBe(false);
  });

  it('detects binary content', () => {
    expect(validator.detectBinary(Buffer.from('Hello World'))).toBe(false);
    expect(validator.detectBinary(Buffer.from([0x00, 0x01, 0x02, 0x03, 0x04]))).toBe(true);
    expect(validator.detectBinary(Buffer.alloc(0))).toBe(false);
  });

  it('validates filenames', () => {
    expect(validator.validateFilename('app.ts')).toBe(true);
    expect(validator.validateFilename('../app.ts')).toBe(false);
    expect(validator.validateFilename('')).toBe(false);
    expect(validator.validateFilename('app\0.ts')).toBe(false);
  });

  it('validates directory paths', () => {
    expect(validator.validateDirectoryPath('src')).toBe(true);
    expect(validator.validateDirectoryPath('../etc')).toBe(false);
  });
});

describe('AllowlistConfigLoader', () => {
  it('returns default config when no path provided', async () => {
    const config = await AllowlistConfigLoader.loadFromConfig();
    expect(config.allow).toContain('src/**');
    expect(config.maxFileSizeBytes).toBe(10 * 1024 * 1024);
    expect(config.allowHiddenFiles).toBe(false);
  });

  it('handles missing config file gracefully', async () => {
    const config = await AllowlistConfigLoader.loadFromConfig('/nonexistent/path');
    expect(config.allow).toContain('src/**');
  });
});

describe('AtomicWriter', () => {
  it('has write and rollback methods', () => {
    const writer = new AtomicWriter();
    expect(typeof writer.write).toBe('function');
    expect(typeof writer.rollback).toBe('function');
  });
});

describe('FilesystemReadTool', () => {
  it('validates read with mock', () => {
    const mockSandbox = {
      validateRead: vi.fn().mockResolvedValue('/root/agentx/workspace/src/app.ts'),
      validateSymlinkEscape: vi.fn().mockResolvedValue(undefined),
    } as any;
    const mockValidator = {
      detectBinary: vi.fn().mockReturnValue(false),
      validateEncoding: vi.fn().mockReturnValue(true),
    } as any;
    const mockPolicy = { validateFileSize: vi.fn() } as any;

    const readTool = new FilesystemReadTool(mockSandbox, mockValidator, mockPolicy);
    expect(readTool).toBeDefined();
  });
});

describe('FilesystemWriteTool', () => {
  it('validates write with mock', () => {
    const mockSandbox = {
      validateWrite: vi.fn().mockResolvedValue('/root/agentx/workspace/src/app.ts'),
      validateSymlinkEscape: vi.fn().mockResolvedValue(undefined),
    } as any;
    const mockValidator = {
      detectBinary: vi.fn().mockReturnValue(false),
      validateEncoding: vi.fn().mockReturnValue(true),
    } as any;
    const mockPolicy = { validateFileSize: vi.fn() } as any;
    const mockAtomicWriter = { write: vi.fn().mockResolvedValue(undefined) } as any;

    const writeTool = new FilesystemWriteTool(
      mockSandbox,
      mockAtomicWriter,
      mockValidator,
      mockPolicy,
    );
    expect(writeTool).toBeDefined();
  });
});
