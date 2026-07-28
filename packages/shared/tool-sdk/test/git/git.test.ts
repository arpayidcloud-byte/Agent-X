/**
 * @module git/git.test
 * @description Comprehensive tests for Git Tool Foundation.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  // Repository
  createNonGitRepositoryInfo,
  parseRepositoryInfo,
  isWithinWorkspace,
  // Validator
  validateStatusOutput,
  validateBranchName,
  validateRef,
  validateCommitMessage,
  detectDangerousFlags,
  isForceOperation,
  isOrphanBranch,
  isEmptyCommit,
  // Approval
  classifyGitOperation,
  // Sandbox
  GitSandbox,
  // Errors
  GitRepositoryNotFoundError,
  GitWorkspaceEscapeError,
  GitInvalidBranchError,
  GitInvalidRefError,
  GitForceNotAllowedError,
  GitTimeoutError,
  GitEmptyCommitError,
  GitOrphanBranchError,
  // Tools
  GitStatusTool,
  GitDiffTool,
  GitLogTool,
  GitBranchTool,
  GitAddTool,
  GitCheckoutTool,
  GitCommitTool,
  GitRestoreTool,
  GitResetTool,
  // Audit
  GitAuditEmitter,
  createGitInvokedEvent,
  createGitFinishedEvent,
  createGitFailedEvent,
  // Executor
  GitExecutor,
  // Types
  GitSandboxConfig,
  GitExecutionContext,
  GitExecutionRequest,
  GitOperation,
} from '../../src/git/index.js';

// ============================================================
// DEFAULT CONFIGS
// ============================================================

const DEFAULT_GIT_CONFIG: GitSandboxConfig = {
  workspaceRoot: '/root/agentx/workspace',
  allowedOperations: [
    'git.status',
    'git.diff',
    'git.log',
    'git.branch',
    'git.show',
    'git.revparse',
    'git.lsfiles',
    'git.add',
    'git.restore',
    'git.checkout',
    'git.commit',
    'git.reset',
  ],
  blockedOperations: [],
  allowForceOperations: false,
  allowDetachedHead: false,
};

const DEFAULT_CONTEXT: GitExecutionContext = {
  workspaceRoot: '/root/agentx/workspace',
  sandboxConfig: DEFAULT_GIT_CONFIG,
};

const DEFAULT_REQUEST: GitExecutionRequest = {
  operation: 'git.status',
  args: [],
  taskId: 'task-1',
  traceId: 'trace-1',
  agentRole: 'coding',
};

// ============================================================
// TESTS: Repository Detection
// ============================================================

describe('Repository Detection', () => {
  it('creates non-git repository info', () => {
    const info = createNonGitRepositoryInfo('/tmp/test');
    expect(info.isGitRepository).toBe(false);
    expect(info.rootPath).toBe('/tmp/test');
    expect(info.isBare).toBe(false);
    expect(info.isWorktree).toBe(false);
    expect(info.isDetachedHead).toBe(false);
  });

  it('parses repository info with branch', () => {
    const info = parseRepositoryInfo('/root/agentx', '/root/agentx/.git', 'ref: refs/heads/main');
    expect(info.isGitRepository).toBe(true);
    expect(info.rootPath).toBe('/root/agentx');
    expect(info.isBare).toBe(false);
    expect(info.isWorktree).toBe(false);
    expect(info.isDetachedHead).toBe(false);
    expect(info.currentBranch).toBe('main');
  });

  it('parses repository info with detached HEAD', () => {
    const hash = 'a'.repeat(40);
    const info = parseRepositoryInfo('/root/agentx', '/root/agentx/.git', hash);
    expect(info.isGitRepository).toBe(true);
    expect(info.isDetachedHead).toBe(true);
    expect(info.headCommitHash).toBe(hash);
    expect(info.currentBranch).toBeUndefined();
  });

  it('parses bare repository', () => {
    const info = parseRepositoryInfo('/root/agentx', '/root/agentx', undefined);
    expect(info.isBare).toBe(true);
  });

  it('parses worktree', () => {
    const info = parseRepositoryInfo(
      '/root/agentx',
      '/root/agentx/.git/worktrees/feature',
      'ref: refs/heads/feature',
    );
    expect(info.isWorktree).toBe(true);
  });

  it('validates workspace containment', () => {
    expect(isWithinWorkspace('/root/agentx/src/app.ts', '/root/agentx')).toBe(true);
    expect(isWithinWorkspace('/root/agentx', '/root/agentx')).toBe(true);
    expect(isWithinWorkspace('/other/path', '/root/agentx')).toBe(false);
  });
});

// ============================================================
// TESTS: Branch Validation
// ============================================================

describe('Branch Validation', () => {
  it('validates correct branch names', () => {
    expect(validateBranchName('main')).toBe(true);
    expect(validateBranchName('feature/my-feature')).toBe(true);
    expect(validateBranchName('bugfix-123')).toBe(true);
    expect(validateBranchName('release/1.0')).toBe(true);
  });

  it('rejects invalid branch names', () => {
    expect(validateBranchName('')).toBe(false);
    expect(validateBranchName('.hidden')).toBe(false);
    expect(validateBranchName('branch..double')).toBe(false);
    expect(validateBranchName('branch~tilde')).toBe(false);
    expect(validateBranchName('branch^caret')).toBe(false);
    expect(validateBranchName('branch?question')).toBe(false);
    expect(validateBranchName('branch*star')).toBe(false);
    expect(validateBranchName('branch[bracket]')).toBe(false);
    expect(validateBranchName('branch\\backslash')).toBe(false);
    expect(validateBranchName('branch//double')).toBe(false);
    expect(validateBranchName('branch.lock')).toBe(false);
  });

  it('validates refs', () => {
    expect(validateRef('main')).toBe(true);
    expect(validateRef('HEAD')).toBe(true);
    expect(validateRef('a'.repeat(40))).toBe(true);
    expect(validateRef('')).toBe(false);
    expect(validateRef('ref with space')).toBe(false);
    expect(validateRef('ref~tilde')).toBe(false);
    expect(validateRef('ref^caret')).toBe(false);
  });

  it('validates commit messages', () => {
    expect(validateCommitMessage('Add new feature')).toBe(true);
    expect(validateCommitMessage('a'.repeat(72))).toBe(true);
    expect(validateCommitMessage('a'.repeat(73))).toBe(false);
    expect(validateCommitMessage('')).toBe(false);
  });
});

// ============================================================
// TESTS: Dangerous Flags Detection
// ============================================================

describe('Dangerous Flags Detection', () => {
  it('detects force flags', () => {
    expect(detectDangerousFlags(['--force'])).toContain('--force');
    expect(detectDangerousFlags(['-f'])).toContain('-f');
  });

  it('detects hard reset flag', () => {
    expect(detectDangerousFlags(['--hard'])).toContain('--hard');
  });

  it('detects orphan branch flag', () => {
    expect(detectDangerousFlags(['--orphan'])).toContain('--orphan');
  });

  it('detects empty commit flag', () => {
    expect(detectDangerousFlags(['--allow-empty'])).toContain('--allow-empty');
  });

  it('returns empty for safe flags', () => {
    expect(detectDangerousFlags(['--verbose', '--quiet'])).toEqual([]);
  });

  it('identifies force operations', () => {
    expect(isForceOperation(['--force'])).toBe(true);
    expect(isForceOperation(['-f'])).toBe(true);
    expect(isForceOperation(['--hard'])).toBe(true);
    expect(isForceOperation(['--verbose'])).toBe(false);
  });

  it('identifies orphan branch operations', () => {
    expect(isOrphanBranch(['--orphan', 'new-branch'])).toBe(true);
    expect(isOrphanBranch(['--orphan'])).toBe(false);
    expect(isOrphanBranch(['--verbose'])).toBe(false);
  });

  it('identifies empty commit operations', () => {
    expect(isEmptyCommit(['--allow-empty'])).toBe(true);
    expect(isEmptyCommit(['--allow-empty-message'])).toBe(true);
    expect(isEmptyCommit(['--verbose'])).toBe(false);
  });
});

// ============================================================
// TESTS: Approval Classification
// ============================================================

describe('Approval Classification', () => {
  it('classifies git.status as Safe', () => {
    const result = classifyGitOperation('git.status');
    expect(result.classification).toBe('Safe');
    expect(result.riskScore).toBe(10);
    expect(result.requiresApproval).toBe(false);
  });

  it('classifies git.diff as Safe', () => {
    const result = classifyGitOperation('git.diff');
    expect(result.classification).toBe('Safe');
    expect(result.riskScore).toBe(10);
  });

  it('classifies git.log as Safe', () => {
    const result = classifyGitOperation('git.log');
    expect(result.classification).toBe('Safe');
    expect(result.riskScore).toBe(10);
  });

  it('classifies git.branch as Safe', () => {
    const result = classifyGitOperation('git.branch');
    expect(result.classification).toBe('Safe');
    expect(result.riskScore).toBe(10);
  });

  it('classifies git.add as PotentiallyDestructive', () => {
    const result = classifyGitOperation('git.add');
    expect(result.classification).toBe('PotentiallyDestructive');
    expect(result.riskScore).toBe(40);
    expect(result.requiresApproval).toBe(true);
  });

  it('classifies git.restore as PotentiallyDestructive', () => {
    const result = classifyGitOperation('git.restore');
    expect(result.classification).toBe('PotentiallyDestructive');
    expect(result.riskScore).toBe(60);
  });

  it('classifies git.checkout as PotentiallyDestructive', () => {
    const result = classifyGitOperation('git.checkout');
    expect(result.classification).toBe('PotentiallyDestructive');
    expect(result.riskScore).toBe(70);
  });

  it('classifies git.commit as PotentiallyDestructive', () => {
    const result = classifyGitOperation('git.commit');
    expect(result.classification).toBe('PotentiallyDestructive');
    expect(result.riskScore).toBe(80);
  });

  it('classifies git.reset as Destructive', () => {
    const result = classifyGitOperation('git.reset');
    expect(result.classification).toBe('Destructive');
    expect(result.riskScore).toBe(95);
    expect(result.requiresApproval).toBe(true);
  });
});

// ============================================================
// TESTS: Git Sandbox
// ============================================================

describe('Git Sandbox', () => {
  let sandbox: GitSandbox;

  beforeEach(() => {
    sandbox = new GitSandbox(DEFAULT_GIT_CONFIG);
  });

  it('validates allowed operations', () => {
    expect(sandbox.isOperationAllowed('git.status')).toBe(true);
    expect(sandbox.isOperationAllowed('git.add')).toBe(true);
  });

  it('rejects blocked operations', () => {
    const config = { ...DEFAULT_GIT_CONFIG, blockedOperations: ['git.reset'] };
    const blockedSandbox = new GitSandbox(config);
    expect(blockedSandbox.isOperationAllowed('git.reset')).toBe(false);
  });

  it('validates request and returns repository info', () => {
    const repoInfo = {
      isGitRepository: true,
      rootPath: '/root/agentx/workspace',
      isBare: false,
      isWorktree: false,
      isDetachedHead: false,
      currentBranch: 'main',
      headCommitHash: 'abc123',
    };
    const result = sandbox.validate(DEFAULT_REQUEST, repoInfo);
    expect(result.isGitRepository).toBe(true);
    expect(result.currentBranch).toBe('main');
  });

  it('throws on non-git repository', () => {
    const repoInfo = createNonGitRepositoryInfo('/tmp');
    expect(() => sandbox.validate(DEFAULT_REQUEST, repoInfo)).toThrow(GitRepositoryNotFoundError);
  });

  it('throws on workspace escape', () => {
    const repoInfo = {
      isGitRepository: true,
      rootPath: '/other/path',
      isBare: false,
      isWorktree: false,
      isDetachedHead: false,
    };
    expect(() => sandbox.validate(DEFAULT_REQUEST, repoInfo)).toThrow(GitWorkspaceEscapeError);
  });

  it('validates working directory within workspace', () => {
    const requestWithDir = {
      ...DEFAULT_REQUEST,
      workingDirectory: '/root/agentx/workspace/src',
    };
    const repoInfo = {
      isGitRepository: true,
      rootPath: '/root/agentx/workspace',
      isBare: false,
      isWorktree: false,
      isDetachedHead: false,
    };
    const result = sandbox.validate(requestWithDir, repoInfo);
    expect(result.isGitRepository).toBe(true);
  });

  it('throws on working directory escape', () => {
    const requestWithDir = {
      ...DEFAULT_REQUEST,
      workingDirectory: '/other/path',
    };
    const repoInfo = {
      isGitRepository: true,
      rootPath: '/root/agentx/workspace',
      isBare: false,
      isWorktree: false,
      isDetachedHead: false,
    };
    expect(() => sandbox.validate(requestWithDir, repoInfo)).toThrow(GitWorkspaceEscapeError);
  });

  it('rejects force operations when disabled', () => {
    const requestWithForce = {
      ...DEFAULT_REQUEST,
      args: ['--force'],
    };
    const repoInfo = {
      isGitRepository: true,
      rootPath: '/root/agentx/workspace',
      isBare: false,
      isWorktree: false,
      isDetachedHead: false,
    };
    expect(() => sandbox.validate(requestWithForce, repoInfo)).toThrow();
  });

  it('allows force operations when enabled', () => {
    const config = { ...DEFAULT_GIT_CONFIG, allowForceOperations: true };
    const forceSandbox = new GitSandbox(config);
    const requestWithForce = {
      ...DEFAULT_REQUEST,
      args: ['--force'],
    };
    const repoInfo = {
      isGitRepository: true,
      rootPath: '/root/agentx/workspace',
      isBare: false,
      isWorktree: false,
      isDetachedHead: false,
    };
    const result = forceSandbox.validate(requestWithForce, repoInfo);
    expect(result.isGitRepository).toBe(true);
  });
});

// ============================================================
// TESTS: Git Validator
// ============================================================

describe('Git Validator', () => {
  it('validates status output', () => {
    expect(validateStatusOutput('On branch main')).toBe(true);
    expect(validateStatusOutput('Changes to be committed')).toBe(true);
    expect(validateStatusOutput('')).toBe(false);
  });

  it('validates branch names', () => {
    expect(validateBranchName('main')).toBe(true);
    expect(validateBranchName('feature/my-feature')).toBe(true);
    expect(validateBranchName('.hidden')).toBe(false);
  });

  it('validates refs', () => {
    expect(validateRef('main')).toBe(true);
    expect(validateRef('HEAD')).toBe(true);
    expect(validateRef('')).toBe(false);
  });

  it('validates commit messages', () => {
    expect(validateCommitMessage('Add feature')).toBe(true);
    expect(validateCommitMessage('a'.repeat(73))).toBe(false);
    expect(validateCommitMessage('')).toBe(false);
  });
});

// ============================================================
// TESTS: Audit Events
// ============================================================

describe('Audit Events', () => {
  let emitter: GitAuditEmitter;

  beforeEach(() => {
    emitter = new GitAuditEmitter();
  });

  it('emits git-specific audit events', () => {
    const event = createGitInvokedEvent(
      'git.status',
      '/root/agentx',
      'main',
      'task-1',
      'trace-1',
      'coding',
    );
    emitter.emitGitEvent(event);
    expect(emitter.getEvents()).toHaveLength(1);
    expect(emitter.getEvents()[0].eventType).toBe('tool.invoked');
  });

  it('creates git invoked event', () => {
    const event = createGitInvokedEvent(
      'git.status',
      '/root/agentx',
      'main',
      'task-1',
      'trace-1',
      'coding',
    );
    expect(event.eventType).toBe('tool.invoked');
    expect(event.operation).toBe('git.status');
    expect(event.repository).toBe('/root/agentx');
    expect(event.branch).toBe('main');
  });

  it('creates git finished event', () => {
    const event = createGitFinishedEvent(
      'git.status',
      '/root/agentx',
      'main',
      'abc123',
      0,
      100,
      'task-1',
      'trace-1',
      'coding',
    );
    expect(event.eventType).toBe('tool.finished');
    expect(event.exitCode).toBe(0);
    expect(event.durationMs).toBe(100);
    expect(event.commitHash).toBe('abc123');
  });

  it('creates git failed event', () => {
    const event = createGitFailedEvent('git.status', '/root/agentx', 'task-1', 'trace-1', 'coding');
    expect(event.eventType).toBe('tool.failed');
    expect(event.allowed).toBe(false);
  });

  it('filters events by operation', () => {
    emitter.emitGitEvent(
      createGitInvokedEvent('git.status', '/root/agentx', 'main', 'task-1', 'trace-1', 'coding'),
    );
    emitter.emitGitEvent(
      createGitInvokedEvent('git.diff', '/root/agentx', 'main', 'task-2', 'trace-2', 'coding'),
    );

    const statusEvents = emitter.getEventsByOperation('git.status');
    expect(statusEvents.length).toBeGreaterThanOrEqual(1);
  });
});

// ============================================================
// TESTS: Git Errors
// ============================================================

describe('Git Errors', () => {
  it('creates GitRepositoryNotFoundError', () => {
    const error = new GitRepositoryNotFoundError('/tmp');
    expect(error.message).toContain('/tmp');
    expect(error.code).toBe('GIT_REPOSITORY_NOT_FOUND');
  });

  it('creates GitWorkspaceEscapeError', () => {
    const error = new GitWorkspaceEscapeError('/other', '/workspace');
    expect(error.message).toContain('/other');
    expect(error.code).toBe('GIT_WORKSPACE_ESCAPE');
  });

  it('creates GitInvalidBranchError', () => {
    const error = new GitInvalidBranchError('.hidden');
    expect(error.message).toContain('.hidden');
    expect(error.code).toBe('GIT_INVALID_BRANCH');
  });

  it('creates GitInvalidRefError', () => {
    const error = new GitInvalidRefError('bad~ref');
    expect(error.message).toContain('bad~ref');
    expect(error.code).toBe('GIT_INVALID_REF');
  });

  it('creates GitForceNotAllowedError', () => {
    const error = new GitForceNotAllowedError('reset --hard');
    expect(error.message).toContain('reset --hard');
    expect(error.code).toBe('GIT_FORCE_NOT_ALLOWED');
  });

  it('creates GitTimeoutError', () => {
    const error = new GitTimeoutError('git.status', 5000);
    expect(error.message).toContain('5000');
    expect(error.code).toBe('GIT_TIMEOUT');
  });

  it('creates GitEmptyCommitError', () => {
    const error = new GitEmptyCommitError();
    expect(error.code).toBe('GIT_EMPTY_COMMIT');
  });

  it('creates GitOrphanBranchError', () => {
    const error = new GitOrphanBranchError('orphan');
    expect(error.message).toContain('orphan');
    expect(error.code).toBe('GIT_ORPHAN_BRANCH');
  });
});

// ============================================================
// TESTS: Git Tools (mock executor)
// ============================================================

describe('Git Tools', () => {
  it('creates GitStatusTool', () => {
    const tool = new GitStatusTool(DEFAULT_CONTEXT);
    expect(tool).toBeDefined();
  });

  it('creates GitDiffTool', () => {
    const tool = new GitDiffTool(DEFAULT_CONTEXT);
    expect(tool).toBeDefined();
  });

  it('creates GitLogTool', () => {
    const tool = new GitLogTool(DEFAULT_CONTEXT);
    expect(tool).toBeDefined();
  });

  it('creates GitBranchTool', () => {
    const tool = new GitBranchTool(DEFAULT_CONTEXT);
    expect(tool).toBeDefined();
  });

  it('creates GitAddTool', () => {
    const tool = new GitAddTool(DEFAULT_CONTEXT);
    expect(tool).toBeDefined();
  });

  it('creates GitCheckoutTool', () => {
    const tool = new GitCheckoutTool(DEFAULT_CONTEXT);
    expect(tool).toBeDefined();
  });

  it('creates GitCommitTool', () => {
    const tool = new GitCommitTool(DEFAULT_CONTEXT);
    expect(tool).toBeDefined();
  });

  it('creates GitRestoreTool', () => {
    const tool = new GitRestoreTool(DEFAULT_CONTEXT);
    expect(tool).toBeDefined();
  });

  it('creates GitResetTool', () => {
    const tool = new GitResetTool(DEFAULT_CONTEXT);
    expect(tool).toBeDefined();
  });

  it('GitResetTool rejects force operations', async () => {
    const tool = new GitResetTool(DEFAULT_CONTEXT);
    const request: GitExecutionRequest = {
      operation: 'git.reset',
      args: ['--hard', 'HEAD~1'],
      taskId: 'task-1',
      traceId: 'trace-1',
      agentRole: 'coding',
    };
    const result = await tool.execute(request);
    expect(result.exitCode).toBe(1);
    expect(result.stderr).toContain('Force reset is not allowed');
  });

  it('GitCommitTool validates commit message', async () => {
    const tool = new GitCommitTool(DEFAULT_CONTEXT);
    const request: GitExecutionRequest = {
      operation: 'git.commit',
      args: ['a'.repeat(73)],
      taskId: 'task-1',
      traceId: 'trace-1',
      agentRole: 'coding',
    };
    const result = await tool.execute(request);
    expect(result.exitCode).toBe(1);
    expect(result.stderr).toContain('Invalid commit message');
  });
});

// ============================================================
// TESTS: Git Executor (mocked)
// ============================================================

describe('Git Executor', () => {
  it('creates executor with context', () => {
    const executor = new GitExecutor(DEFAULT_CONTEXT);
    expect(executor).toBeDefined();
  });

  it('returns audit emitter', () => {
    const executor = new GitExecutor(DEFAULT_CONTEXT);
    expect(executor.getAuditEmitter()).toBeDefined();
  });
});

// ============================================================
// TESTS: Integration - Status Parsing
// ============================================================

describe('Status Parsing', () => {
  it('parses git status output', () => {
    const tool = new GitStatusTool(DEFAULT_CONTEXT);
    const output = 'M  src/app.ts\n A  src/new.ts\n?? src/untracked.ts';
    const result = (tool as any).parseStatus(output);
    expect(result.changed).toHaveLength(3);
    expect(result.changed[0].path).toBe('src/app.ts');
    expect(result.changed[0].indexStatus).toBe('M');
  });

  it('handles empty status output', () => {
    const tool = new GitStatusTool(DEFAULT_CONTEXT);
    const result = (tool as any).parseStatus('');
    expect(result.changed).toHaveLength(0);
  });
});

// ============================================================
// TESTS: Integration - Diff Parsing
// ============================================================

describe('Diff Parsing', () => {
  it('parses git diff output', () => {
    const tool = new GitDiffTool(DEFAULT_CONTEXT);
    const output = 'diff --git a/src/app.ts b/src/app.ts\n@@ -1,5 +1,6 @@\n+ new line\n existing';
    const result = (tool as any).parseDiff(output);
    expect(result.files).toHaveLength(1);
    expect(result.files[0].path).toBe('src/app.ts');
  });

  it('handles empty diff output', () => {
    const tool = new GitDiffTool(DEFAULT_CONTEXT);
    const result = (tool as any).parseDiff('');
    expect(result.files).toHaveLength(0);
  });
});

// ============================================================
// TESTS: Integration - Log Parsing
// ============================================================

describe('Log Parsing', () => {
  it('parses git log output', () => {
    const tool = new GitLogTool(DEFAULT_CONTEXT);
    const output = 'abc123|John Doe|john@example.com|2024-01-01|Initial commit';
    const result = (tool as any).parseLog(output);
    expect(result.entries).toHaveLength(1);
    expect(result.entries[0].hash).toBe('abc123');
    expect(result.entries[0].author).toBe('John Doe');
  });

  it('handles empty log output', () => {
    const tool = new GitLogTool(DEFAULT_CONTEXT);
    const result = (tool as any).parseLog('');
    expect(result.entries).toHaveLength(0);
  });
});

// ============================================================
// TESTS: Integration - Branch Parsing
// ============================================================

describe('Branch Parsing', () => {
  it('parses git branch output', () => {
    const tool = new GitBranchTool(DEFAULT_CONTEXT);
    const output = '* main\n  feature/my-feature\n  remotes/origin/develop';
    const result = (tool as any).parseBranches(output);
    expect(result.branches).toHaveLength(3);
    expect(result.branches[0].name).toBe('main');
    expect(result.branches[0].current).toBe(true);
    expect(result.branches[2].remote).toBe(true);
  });

  it('handles empty branch output', () => {
    const tool = new GitBranchTool(DEFAULT_CONTEXT);
    const result = (tool as any).parseBranches('');
    expect(result.branches).toHaveLength(0);
  });
});
