/**
 * @module developer-platform/developer-platform.test
 * @description Comprehensive tests for M6.1 Developer Platform & Enterprise Control Plane.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  InvariantViolationError,
  SDKRegistry,
  SDKGenerator,
  APISpecManager,
  OpenAPIGenerator,
  ClientGenerator,
  CLIEngine,
  SDKEntry,
  GeneratedCode,
  APISpec,
  OpenAPIDocument,
  ClientCode,
  CLICommand,
  DeveloperProjectManager,
  PackageRegistry,
  ArtifactRegistry,
  VersionRegistry,
  ReleaseManager,
  DocumentationEngine,
  ExampleRepositoryManager,
  PackageEntry,
  ArtifactEntry,
  VersionEntry,
  ReleaseEntry,
  DocPage,
  ExampleEntry,
  DeveloperPlatformCoordinator,
  SDKCoordinator,
  APICoordinator,
  DocumentationCoordinator,
  ReleaseCoordinator,
  MarketplaceCoordinator,
  ControlPlaneCoordinator,
  RemoteManagementCoordinator,
  DeveloperPortal,
  APIExplorer,
  InteractivePlayground,
  TemplateLibrary,
  DashboardBuilder,
  ReportGenerator,
  RuntimeAnalytics,
  UsageAnalytics,
  PerformanceAnalytics,
  RemoteRuntimeManager,
  RemoteConfiguration,
  RemoteDeployment,
  RemoteUpgrade,
  RemoteDiagnostics,
  TypeScriptSDK,
  GoSDK,
  PythonSDK,
  RustSDK,
  CLISDK,
  PluginMarketplace,
  ExtensionMarketplace,
  PackageMarketplace,
  ArtifactRepository,
  DashboardManager,
  ReportTemplateManager,
  MetricSummarizer,
} from '../src/index.js';

// ============================================================================
// InvariantViolationError
// ============================================================================
describe('InvariantViolationError', () => {
  it('creates with all properties', () => {
    const err = new InvariantViolationError('msg', 'CODE', 'src');
    expect(err.message).toBe('msg');
    expect(err.code).toBe('CODE');
    expect(err.source).toBe('src');
    expect(err.name).toBe('InvariantViolationError');
  });
});

// ============================================================================
// SDKRegistry
// ============================================================================
describe('SDKRegistry', () => {
  let reg: SDKRegistry;
  beforeEach(() => {
    reg = new SDKRegistry();
  });

  it('registers SDKs', () => {
    const sdk = reg.register('agentx-ts', 'typescript', '1.0.0');
    expect(sdk.name).toBe('agentx-ts');
    expect(sdk.status).toBe('PUBLISHED');
  });

  it('finds by language', () => {
    reg.register('a', 'typescript', '1.0.0');
    reg.register('b', 'go', '1.0.0');
    expect(reg.findByLanguage('typescript')).toHaveLength(1);
    expect(reg.findByLanguage('python')).toHaveLength(0);
  });

  it('deprecates SDKs', () => {
    const sdk = reg.register('a', 'typescript', '1.0.0');
    reg.deprecate(sdk.sdkId);
    expect(reg.get(sdk.sdkId)?.status).toBe('DEPRECATED');
  });

  it('throws on deprecate missing SDK', () => {
    expect(() => reg.deprecate('missing')).toThrow('SDK not found');
  });

  it('gets all', () => {
    reg.register('a', 'ts', '1');
    expect(reg.getAll()).toHaveLength(1);
  });
});

// ============================================================================
// SDKGenerator
// ============================================================================
describe('SDKGenerator', () => {
  it('generates code', () => {
    const gen = new SDKGenerator();
    const code = gen.generate('sdk-1', 'typescript', { spec: true });
    expect(code.content).toContain('typescript');
    expect(code.filename).toBe('agentx-typescript.ts');
  });
});

// ============================================================================
// APISpecManager
// ============================================================================
describe('APISpecManager', () => {
  let mgr: APISpecManager;
  beforeEach(() => {
    mgr = new APISpecManager();
  });

  it('creates and retrieves specs', () => {
    const spec = mgr.create('AgentX API', '1.0.0', [
      { path: '/api/v1', method: 'GET', description: 'test' },
    ]);
    expect(spec.title).toBe('AgentX API');
    expect(mgr.get(spec.specId)).toBeDefined();
    expect(mgr.get('missing')).toBeUndefined();
    expect(mgr.getAll()).toHaveLength(1);
  });
});

// ============================================================================
// OpenAPIGenerator
// ============================================================================
describe('OpenAPIGenerator', () => {
  it('generates JSON', () => {
    const gen = new OpenAPIGenerator();
    const spec: APISpec = {
      specId: 's1',
      title: 'Test',
      version: '1.0',
      endpoints: [],
      checksum: 'c',
    };
    const doc = gen.generate(spec, 'JSON');
    expect(doc.format).toBe('JSON');
    expect(doc.content).toContain('openapi');
  });

  it('generates YAML', () => {
    const gen = new OpenAPIGenerator();
    const spec: APISpec = {
      specId: 's1',
      title: 'Test',
      version: '1.0',
      endpoints: [],
      checksum: 'c',
    };
    const doc = gen.generate(spec, 'YAML');
    expect(doc.format).toBe('YAML');
  });
});

// ============================================================================
// ClientGenerator
// ============================================================================
describe('ClientGenerator', () => {
  it('generates client code', () => {
    const gen = new ClientGenerator();
    const client = gen.generate('typescript', 'spec-1');
    expect(client.language).toBe('typescript');
    expect(client.content).toContain('typescript');
  });
});

// ============================================================================
// CLIEngine
// ============================================================================
describe('CLIEngine', () => {
  let engine: CLIEngine;
  beforeEach(() => {
    engine = new CLIEngine();
  });

  it('registers and executes commands', () => {
    const cmd = engine.register('deploy', 'Deploy app', 'deploy-handler');
    expect(engine.execute(cmd.commandId)).toContain('deploy');
  });

  it('throws on execute missing command', () => {
    expect(() => engine.execute('missing')).toThrow('Command not found');
  });

  it('gets command', () => {
    const cmd = engine.register('test', 'Test', 'handler');
    expect(engine.get(cmd.commandId)).toBeDefined();
    expect(engine.get('missing')).toBeUndefined();
    expect(engine.getAll()).toHaveLength(1);
  });
});

// ============================================================================
// DeveloperProjectManager
// ============================================================================
describe('DeveloperProjectManager', () => {
  let mgr: DeveloperProjectManager;
  beforeEach(() => {
    mgr = new DeveloperProjectManager();
  });

  it('creates and retrieves projects', () => {
    const proj = mgr.create('My App', 'acc-1');
    expect(proj.name).toBe('My App');
    expect(mgr.get(proj.projectId)).toBeDefined();
    expect(mgr.get('missing')).toBeUndefined();
  });

  it('gets by account', () => {
    mgr.create('A', 'acc-1');
    mgr.create('B', 'acc-2');
    expect(mgr.getByAccount('acc-1')).toHaveLength(1);
  });

  it('deletes projects', () => {
    const proj = mgr.create('A', 'acc-1');
    expect(mgr.delete(proj.projectId)).toBe(true);
  });

  it('gets all', () => {
    mgr.create('A', 'acc-1');
    expect(mgr.getAll()).toHaveLength(1);
  });
});

// ============================================================================
// PackageRegistry
// ============================================================================
describe('PackageRegistry', () => {
  let reg: PackageRegistry;
  beforeEach(() => {
    reg = new PackageRegistry();
  });

  it('publishes packages', () => {
    const pkg = reg.publish('agentx-sdk', '1.0.0', 'SDK');
    expect(pkg.name).toBe('agentx-sdk');
    expect(pkg.type).toBe('SDK');
  });

  it('gets package by id', () => {
    const pkg = reg.publish('a', '1.0', 'SDK');
    expect(reg.get(pkg.packageId)).toBeDefined();
    expect(reg.get('missing')).toBeUndefined();
  });

  it('finds by name', () => {
    reg.publish('a', '1.0', 'SDK');
    reg.publish('b', '1.0', 'PLUGIN');
    expect(reg.findByName('a')).toHaveLength(1);
    expect(reg.findByName('missing')).toHaveLength(0);
  });

  it('gets all', () => {
    reg.publish('a', '1.0', 'SDK');
    expect(reg.getAll()).toHaveLength(1);
  });
});

// ============================================================================
// ArtifactRegistry
// ============================================================================
describe('ArtifactRegistry', () => {
  it('uploads and retrieves artifacts', () => {
    const reg = new ArtifactRegistry();
    const art = reg.upload('build.zip', 'binary', 1024);
    expect(art.name).toBe('build.zip');
    expect(reg.get(art.artifactId)).toBeDefined();
    expect(reg.delete(art.artifactId)).toBe(true);
    expect(reg.getAll()).toHaveLength(0);
  });
});

// ============================================================================
// VersionRegistry
// ============================================================================
describe('VersionRegistry', () => {
  it('registers and retrieves versions', () => {
    const reg = new VersionRegistry();
    const ver = reg.register('pkg-1', '1.0.0');
    expect(ver.version).toBe('1.0.0');
    expect(reg.get(ver.versionId)).toBeDefined();
    expect(reg.getByPackage('pkg-1')).toHaveLength(1);
    expect(reg.getAll()).toHaveLength(1);
  });
});

// ============================================================================
// ReleaseManager
// ============================================================================
describe('ReleaseManager', () => {
  let mgr: ReleaseManager;
  beforeEach(() => {
    mgr = new ReleaseManager();
  });

  it('publishes releases', () => {
    const rel = mgr.publish('pkg-1', '1.0.0');
    expect(rel.status).toBe('PUBLISHED');
    expect(mgr.get(rel.releaseId)).toBeDefined();
  });

  it('archives releases', () => {
    const rel = mgr.publish('pkg-1', '1.0.0');
    mgr.archive(rel.releaseId);
    expect(mgr.get(rel.releaseId)?.status).toBe('ARCHIVED');
  });

  it('throws on archive missing release', () => {
    expect(() => mgr.archive('missing')).toThrow('Release not found');
  });

  it('gets all', () => {
    mgr.publish('a', '1.0');
    expect(mgr.getAll()).toHaveLength(1);
  });
});

// ============================================================================
// DocumentationEngine
// ============================================================================
describe('DocumentationEngine', () => {
  let eng: DocumentationEngine;
  beforeEach(() => {
    eng = new DocumentationEngine();
  });

  it('creates and retrieves pages', () => {
    const page = eng.create('Getting Started', 'content', 'guide');
    expect(page.title).toBe('Getting Started');
    expect(eng.get(page.pageId)).toBeDefined();
    expect(eng.get('missing')).toBeUndefined();
  });

  it('gets by category', () => {
    eng.create('A', 'c', 'guide');
    eng.create('B', 'c', 'api');
    expect(eng.getByCategory('guide')).toHaveLength(1);
  });

  it('gets all', () => {
    eng.create('A', 'c', 'guide');
    expect(eng.getAll()).toHaveLength(1);
  });
});

// ============================================================================
// ExampleRepositoryManager
// ============================================================================
describe('ExampleRepositoryManager', () => {
  let mgr: ExampleRepositoryManager;
  beforeEach(() => {
    mgr = new ExampleRepositoryManager();
  });

  it('adds and retrieves examples', () => {
    const ex = mgr.add('Hello World', 'typescript', 'console.log("hello")');
    expect(ex.title).toBe('Hello World');
    expect(mgr.get(ex.exampleId)).toBeDefined();
    expect(mgr.get('missing')).toBeUndefined();
  });

  it('gets by language', () => {
    mgr.add('A', 'typescript', 'a');
    mgr.add('B', 'go', 'b');
    expect(mgr.getByLanguage('typescript')).toHaveLength(1);
  });

  it('gets all', () => {
    mgr.add('A', 'ts', 'a');
    expect(mgr.getAll()).toHaveLength(1);
  });
});

// ============================================================================
// Application Coordinators
// ============================================================================
describe('DeveloperPlatformCoordinator', () => {
  it('creates projects and publishes packages', () => {
    const projects = new DeveloperProjectManager();
    const packages = new PackageRegistry();
    const coord = new DeveloperPlatformCoordinator(projects, packages);
    const projectId = coord.createProject('My App', 'acc-1');
    expect(projectId).toBeDefined();
    const packageId = coord.publishPackage('sdk', '1.0.0');
    expect(packageId).toBeDefined();
  });
});

describe('SDKCoordinator', () => {
  it('registers and generates SDKs', () => {
    const reg = new SDKRegistry();
    const gen = new SDKGenerator();
    const coord = new SDKCoordinator(reg, gen);
    const sdkId = coord.registerSDK('agentx-ts', 'typescript', '1.0.0');
    expect(sdkId).toBeDefined();
    const content = coord.generateSDK(sdkId, 'typescript');
    expect(content).toContain('typescript');
  });
});

describe('APICoordinator', () => {
  it('creates API and generates docs', () => {
    const specMgr = new APISpecManager();
    const openAPI = new OpenAPIGenerator();
    const clientGen = new ClientGenerator();
    const coord = new APICoordinator(specMgr, openAPI, clientGen);
    const specId = coord.createAPI('AgentX API', '1.0.0');
    expect(specId).toBeDefined();
    const docs = coord.generateDocs(specId);
    expect(docs).toContain('openapi');
  });

  it('throws on generate docs for missing spec', () => {
    const coord = new APICoordinator(
      new APISpecManager(),
      new OpenAPIGenerator(),
      new ClientGenerator(),
    );
    expect(() => coord.generateDocs('missing')).toThrow('Spec not found');
  });

  it('generates client', () => {
    const coord = new APICoordinator(
      new APISpecManager(),
      new OpenAPIGenerator(),
      new ClientGenerator(),
    );
    const specId = coord.createAPI('API', '1.0');
    const client = coord.generateClient('typescript', specId);
    expect(client).toContain('typescript');
  });
});

describe('DocumentationCoordinator', () => {
  it('publishes docs', () => {
    const coord = new DocumentationCoordinator(new DocumentationEngine());
    const pageId = coord.publishDoc('Guide', 'content', 'guide');
    expect(pageId).toBeDefined();
  });
});

describe('ReleaseCoordinator', () => {
  it('publishes and archives releases', () => {
    const mgr = new ReleaseManager();
    const coord = new ReleaseCoordinator(mgr);
    const releaseId = coord.publishRelease('pkg', '1.0.0');
    expect(releaseId).toBeDefined();
    coord.archiveRelease(releaseId);
    expect(mgr.get(releaseId)?.status).toBe('ARCHIVED');
  });
});

describe('MarketplaceCoordinator', () => {
  it('lists items', () => {
    const coord = new MarketplaceCoordinator();
    const itemId = coord.list('my-plugin', 'PLUGIN');
    expect(itemId).toBeDefined();
    expect(coord.get(itemId)).toBeDefined();
    expect(coord.getAll()).toHaveLength(1);
  });
});

describe('ControlPlaneCoordinator', () => {
  it('creates dashboards', () => {
    const coord = new ControlPlaneCoordinator();
    const dashboardId = coord.createDashboard('Runtime', 'runtime');
    expect(dashboardId).toBeDefined();
    expect(coord.get(dashboardId)).toBeDefined();
    expect(coord.getAll()).toHaveLength(1);
  });
});

describe('RemoteManagementCoordinator', () => {
  it('executes remote commands', () => {
    const coord = new RemoteManagementCoordinator();
    const commandId = coord.execute('restart', 'runtime-1');
    expect(commandId).toBeDefined();
    expect(coord.get(commandId)).toBeDefined();
    expect(coord.getAll()).toHaveLength(1);
  });
});

// ============================================================================
// Platform Infrastructure
// ============================================================================
describe('DeveloperPortal', () => {
  it('creates and retrieves pages', () => {
    const portal = new DeveloperPortal();
    const page = portal.createPage('Home', 'Welcome', 'landing');
    expect(page.title).toBe('Home');
    expect(portal.getPage(page.pageId)).toBeDefined();
    expect(portal.getPage('missing')).toBeUndefined();
    expect(portal.getAll()).toHaveLength(1);
  });
});

describe('APIExplorer', () => {
  it('adds and retrieves endpoints', () => {
    const explorer = new APIExplorer();
    const ep = explorer.addEndpoint('GET', '/api/v1', 'List items');
    expect(ep.method).toBe('GET');
    expect(explorer.getEndpoint(ep.endpointId)).toBeDefined();
    expect(explorer.getEndpoint('missing')).toBeUndefined();
    expect(explorer.getAll()).toHaveLength(1);
  });
});

describe('InteractivePlayground', () => {
  it('creates and retrieves sessions', () => {
    const pg = new InteractivePlayground();
    const session = pg.createSession('typescript', 'console.log("hello")');
    expect(session.language).toBe('typescript');
    expect(pg.getSession(session.sessionId)).toBeDefined();
    expect(pg.getSession('missing')).toBeUndefined();
    expect(pg.getAll()).toHaveLength(1);
  });
});

describe('TemplateLibrary', () => {
  it('adds and retrieves templates', () => {
    const lib = new TemplateLibrary();
    const tpl = lib.add('Basic', 'typescript', 'template content');
    expect(tpl.name).toBe('Basic');
    expect(lib.get(tpl.templateId)).toBeDefined();
    expect(lib.get('missing')).toBeUndefined();
  });

  it('gets by language', () => {
    const lib = new TemplateLibrary();
    lib.add('A', 'typescript', 'a');
    lib.add('B', 'go', 'b');
    expect(lib.getByLanguage('typescript')).toHaveLength(1);
  });

  it('gets all', () => {
    const lib = new TemplateLibrary();
    lib.add('A', 'ts', 'a');
    expect(lib.getAll()).toHaveLength(1);
  });
});

describe('DashboardBuilder', () => {
  it('adds and retrieves widgets', () => {
    const builder = new DashboardBuilder();
    const widget = builder.addWidget('CPU', 'gauge', { max: 100 });
    expect(widget.title).toBe('CPU');
    expect(builder.getWidget(widget.widgetId)).toBeDefined();
    expect(builder.getWidget('missing')).toBeUndefined();
    expect(builder.getAll()).toHaveLength(1);
  });
});

describe('ReportGenerator', () => {
  it('generates and retrieves reports', () => {
    const gen = new ReportGenerator();
    const report = gen.generate('Monthly', 'monthly', { count: 100 });
    expect(report.title).toBe('Monthly');
    expect(gen.get(report.reportId)).toBeDefined();
    expect(gen.get('missing')).toBeUndefined();
    expect(gen.getAll()).toHaveLength(1);
  });
});

describe('RuntimeAnalytics', () => {
  it('records and queries', () => {
    const analytics = new RuntimeAnalytics();
    analytics.record('latency', 100);
    analytics.record('latency', 200);
    expect(analytics.query('latency')).toHaveLength(2);
    expect(analytics.query('throughput')).toHaveLength(0);
    expect(analytics.getAll()).toHaveLength(2);
  });
});

describe('UsageAnalytics', () => {
  it('records and retrieves usage', () => {
    const usage = new UsageAnalytics();
    usage.record('api-call');
    usage.record('api-call');
    usage.record('deploy');
    expect(usage.getCount('api-call')).toBe(2);
    expect(usage.getCount('unknown')).toBe(0);
    expect(usage.getAll()).toEqual({ 'api-call': 2, deploy: 1 });
  });
});

describe('PerformanceAnalytics', () => {
  it('records and computes metrics', () => {
    const perf = new PerformanceAnalytics();
    perf.record('deploy', 100);
    perf.record('deploy', 200);
    expect(perf.getAverage('deploy')).toBe(150);
    expect(perf.getPercentile('deploy', 0.95)).toBe(200);
    expect(perf.getAverage('unknown')).toBe(0);
    expect(perf.getPercentile('unknown', 0.95)).toBe(0);
    expect(perf.getAll()).toBeDefined();
  });

  it('handles empty metrics', () => {
    const perf = new PerformanceAnalytics();
    expect(perf.getPercentile('empty', 0.95)).toBe(0);
  });

  it('handles multiple data points', () => {
    const perf = new PerformanceAnalytics();
    for (let i = 1; i <= 100; i++) {
      perf.record('op', i);
    }
    expect(perf.getPercentile('op', 0.95)).toBe(96);
  });
});

// ============================================================================
// Control Plane Infrastructure
// ============================================================================
describe('RemoteRuntimeManager', () => {
  it('executes commands', () => {
    const mgr = new RemoteRuntimeManager();
    const cmd = mgr.execute('restart', 'runtime-1');
    expect(cmd.status).toBe('COMPLETED');
    expect(mgr.getCommands()).toHaveLength(1);
  });
});

describe('RemoteConfiguration', () => {
  it('sets and gets config', () => {
    const cfg = new RemoteConfiguration();
    const entry = cfg.set('db.host', 'localhost');
    expect(entry.key).toBe('db.host');
    expect(cfg.get(entry.configId)).toBeDefined();
    expect(cfg.get('missing')).toBeUndefined();
    expect(cfg.getAll()).toHaveLength(1);
  });

  it('sets object values', () => {
    const cfg = new RemoteConfiguration();
    const entry = cfg.set('db.config', { host: 'localhost', port: 5432 });
    expect(entry.value).toEqual({ host: 'localhost', port: 5432 });
  });

  it('sets primitive values', () => {
    const cfg = new RemoteConfiguration();
    const entry = cfg.set('db.port', 5432);
    expect(entry.value).toBe(5432);
  });
});

describe('RemoteDeployment', () => {
  it('deploys and retrieves', () => {
    const deploy = new RemoteDeployment();
    const entry = deploy.deploy('prod', '1.0.0');
    expect(entry.status).toBe('DEPLOYED');
    expect(deploy.get(entry.deploymentId)).toBeDefined();
    expect(deploy.get('missing')).toBeUndefined();
    expect(deploy.getAll()).toHaveLength(1);
  });
});

describe('RemoteUpgrade', () => {
  it('upgrades and retrieves', () => {
    const upgrade = new RemoteUpgrade();
    const entry = upgrade.upgrade('1.0.0', '2.0.0');
    expect(entry.status).toBe('COMPLETED');
    expect(upgrade.getUpgrades()).toHaveLength(1);
  });
});

describe('RemoteDiagnostics', () => {
  it('runs diagnostics', () => {
    const diag = new RemoteDiagnostics();
    const entry = diag.run('db', ['connection ok', 'latency ok']);
    expect(entry.findings).toHaveLength(2);
    expect(diag.getDiagnostics()).toHaveLength(1);
  });
});

// ============================================================================
// SDK Infrastructure
// ============================================================================
describe('TypeScriptSDK', () => {
  it('generates packages', () => {
    const sdk = new TypeScriptSDK();
    const pkg = sdk.generate('AgentX', '1.0.0');
    expect(pkg.language).toBe('typescript');
    expect(pkg.content).toContain('AgentX');
    expect(sdk.get(pkg.packageId)).toBeDefined();
    expect(sdk.get('missing')).toBeUndefined();
    expect(sdk.getAll()).toHaveLength(1);
  });
});

describe('GoSDK', () => {
  it('generates packages', () => {
    const sdk = new GoSDK();
    const pkg = sdk.generate('agentx', '1.0.0');
    expect(pkg.language).toBe('go');
    expect(pkg.content).toContain('package agentx');
    expect(sdk.get(pkg.packageId)).toBeDefined();
    expect(sdk.get('missing')).toBeUndefined();
    expect(sdk.getAll()).toHaveLength(1);
  });
});

describe('PythonSDK', () => {
  it('generates packages', () => {
    const sdk = new PythonSDK();
    const pkg = sdk.generate('AgentX', '1.0.0');
    expect(pkg.language).toBe('python');
    expect(pkg.content).toContain('__version__');
    expect(sdk.get(pkg.packageId)).toBeDefined();
    expect(sdk.get('missing')).toBeUndefined();
    expect(sdk.getAll()).toHaveLength(1);
  });
});

describe('RustSDK', () => {
  it('generates packages', () => {
    const sdk = new RustSDK();
    const pkg = sdk.generate('AgentX', '1.0.0');
    expect(pkg.language).toBe('rust');
    expect(pkg.content).toContain('VERSION');
    expect(sdk.get(pkg.packageId)).toBeDefined();
    expect(sdk.get('missing')).toBeUndefined();
    expect(sdk.getAll()).toHaveLength(1);
  });
});

describe('CLISDK', () => {
  it('generates binaries', () => {
    const sdk = new CLISDK();
    const binary = sdk.generate('agentx', '1.0.0', 'linux');
    expect(binary.platform).toBe('linux');
    expect(sdk.get(binary.binaryId)).toBeDefined();
    expect(sdk.get('missing')).toBeUndefined();
    expect(sdk.getAll()).toHaveLength(1);
  });
});

// ============================================================================
// Marketplace Infrastructure
// ============================================================================
describe('PluginMarketplace', () => {
  it('lists plugins', () => {
    const mp = new PluginMarketplace();
    const listing = mp.list('my-plugin', '1.0.0', 'author');
    expect(listing.type).toBe('PLUGIN');
    expect(mp.get(listing.listingId)).toBeDefined();
    expect(mp.get('missing')).toBeUndefined();
    expect(mp.getAll()).toHaveLength(1);
  });
});

describe('ExtensionMarketplace', () => {
  it('lists extensions', () => {
    const mp = new ExtensionMarketplace();
    const listing = mp.list('my-ext', '1.0.0', 'author');
    expect(listing.type).toBe('EXTENSION');
    expect(mp.get(listing.listingId)).toBeDefined();
    expect(mp.get('missing')).toBeUndefined();
    expect(mp.getAll()).toHaveLength(1);
  });
});

describe('PackageMarketplace', () => {
  it('lists packages', () => {
    const mp = new PackageMarketplace();
    const listing = mp.list('my-pkg', '1.0.0', 'author');
    expect(listing.type).toBe('PACKAGE');
    expect(mp.get(listing.listingId)).toBeDefined();
    expect(mp.get('missing')).toBeUndefined();
    expect(mp.getAll()).toHaveLength(1);
  });
});

describe('ArtifactRepository', () => {
  it('uploads and manages artifacts', () => {
    const repo = new ArtifactRepository();
    const art = repo.upload('build.zip', 'binary', 1024);
    expect(art.name).toBe('build.zip');
    expect(repo.get(art.artifactId)).toBeDefined();
    expect(repo.get('missing')).toBeUndefined();
    expect(repo.delete(art.artifactId)).toBe(true);
    expect(repo.getAll()).toHaveLength(0);
  });
});

// ============================================================================
// Observability Infrastructure
// ============================================================================
describe('DashboardManager', () => {
  it('creates and retrieves dashboards', () => {
    const mgr = new DashboardManager();
    const dash = mgr.create('Runtime', 'runtime', ['cpu', 'mem']);
    expect(dash.name).toBe('Runtime');
    expect(dash.widgets).toHaveLength(2);
    expect(mgr.get(dash.dashboardId)).toBeDefined();
    expect(mgr.get('missing')).toBeUndefined();
    expect(mgr.getAll()).toHaveLength(1);
  });
});

describe('ReportTemplateManager', () => {
  it('creates and retrieves templates', () => {
    const mgr = new ReportTemplateManager();
    const tpl = mgr.create('Monthly', 'pdf');
    expect(tpl.name).toBe('Monthly');
    expect(mgr.get(tpl.templateId)).toBeDefined();
    expect(mgr.get('missing')).toBeUndefined();
    expect(mgr.getAll()).toHaveLength(1);
  });
});

describe('MetricSummarizer', () => {
  it('records and queries', () => {
    const summarizer = new MetricSummarizer();
    summarizer.record('cpu', 50);
    summarizer.record('cpu', 75);
    summarizer.record('mem', 60);
    expect(summarizer.query('cpu')).toHaveLength(2);
    expect(summarizer.query('mem')).toHaveLength(1);
    expect(summarizer.getAll()).toHaveLength(3);
  });
});

// ============================================================================
// Integration Test
// ============================================================================
describe('Developer Platform Integration', () => {
  it('full pipeline: create project, register SDK, publish, release', () => {
    const projects = new DeveloperProjectManager();
    const packages = new PackageRegistry();
    const sdkReg = new SDKRegistry();
    const sdkGen = new SDKGenerator();
    const releaseMgr = new ReleaseManager();
    const docs = new DocumentationEngine();

    const platformCoord = new DeveloperPlatformCoordinator(projects, packages);
    const sdkCoord = new SDKCoordinator(sdkReg, sdkGen);
    const releaseCoord = new ReleaseCoordinator(releaseMgr);
    const docCoord = new DocumentationCoordinator(docs);

    const projectId = platformCoord.createProject('AgentX App', 'dev-1');
    expect(projectId).toBeDefined();

    const sdkId = sdkCoord.registerSDK('agentx-sdk', 'typescript', '1.0.0');
    expect(sdkId).toBeDefined();

    const content = sdkCoord.generateSDK(sdkId, 'typescript');
    expect(content).toContain('typescript');

    const packageId = platformCoord.publishPackage('agentx-sdk', '1.0.0');
    expect(packageId).toBeDefined();

    const releaseId = releaseCoord.publishRelease('agentx-sdk', '1.0.0');
    expect(releaseId).toBeDefined();

    const pageId = docCoord.publishDoc('Getting Started', 'Welcome to AgentX', 'guide');
    expect(pageId).toBeDefined();
  });
});
