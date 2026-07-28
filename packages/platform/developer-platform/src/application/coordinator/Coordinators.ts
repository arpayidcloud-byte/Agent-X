import { createHash } from 'crypto';
import type {
  SDKRegistry,
  SDKGenerator,
  APISpecManager,
  OpenAPIGenerator,
  ClientGenerator,
} from '../../domain/sdk/SDKManager.js';
import type {
  DeveloperProjectManager,
  PackageRegistry,
  ReleaseManager,
  DocumentationEngine,
} from '../../domain/developer/DeveloperManager.js';

export class DeveloperPlatformCoordinator {
  constructor(
    private projects: DeveloperProjectManager,
    private packages: PackageRegistry,
  ) {}

  createProject(name: string, accountId: string): string {
    const project = this.projects.create(name, accountId);
    return project.projectId;
  }

  publishPackage(name: string, version: string): string {
    const pkg = this.packages.publish(name, version, 'SDK');
    return pkg.packageId;
  }
}

export class SDKCoordinator {
  constructor(
    private sdkRegistry: SDKRegistry,
    private generator: SDKGenerator,
  ) {}

  registerSDK(name: string, language: string, version: string): string {
    const sdk = this.sdkRegistry.register(name, language, version);
    return sdk.sdkId;
  }

  generateSDK(sdkId: string, language: string): string {
    const code = this.generator.generate(sdkId, language, {});
    return code.content;
  }
}

export class APICoordinator {
  constructor(
    private specManager: APISpecManager,
    private openAPI: OpenAPIGenerator,
    private clientGen: ClientGenerator,
  ) {}

  createAPI(title: string, version: string): string {
    const spec = this.specManager.create(title, version, []);
    return spec.specId;
  }

  generateDocs(specId: string): string {
    const spec = this.specManager.get(specId);
    if (!spec) throw new Error(`Spec not found: ${specId}`);
    const doc = this.openAPI.generate(spec, 'JSON');
    return doc.content;
  }

  generateClient(language: string, specId: string): string {
    const client = this.clientGen.generate(language, specId);
    return client.content;
  }
}

export class DocumentationCoordinator {
  constructor(private docs: DocumentationEngine) {}

  publishDoc(title: string, content: string, category: string): string {
    const page = this.docs.create(title, content, category);
    return page.pageId;
  }
}

export class ReleaseCoordinator {
  constructor(private releaseManager: ReleaseManager) {}

  publishRelease(packageName: string, version: string): string {
    const release = this.releaseManager.publish(packageName, version);
    return release.releaseId;
  }

  archiveRelease(releaseId: string): void {
    this.releaseManager.archive(releaseId);
  }
}

export class MarketplaceCoordinator {
  private listings = new Map<
    string,
    { itemId: string; name: string; type: string; checksum: string }
  >();

  list(name: string, type: string): string {
    const itemId = `mp-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
    const checksum = createHash('sha256')
      .update(JSON.stringify({ itemId, name, type }))
      .digest('hex');
    const listing = Object.freeze({ itemId, name, type, checksum });
    this.listings.set(itemId, listing);
    return itemId;
  }

  get(itemId: string) {
    return this.listings.get(itemId);
  }

  getAll() {
    return Array.from(this.listings.values());
  }
}

export class ControlPlaneCoordinator {
  private dashboards = new Map<
    string,
    { dashboardId: string; name: string; type: string; checksum: string }
  >();

  createDashboard(name: string, type: string): string {
    const dashboardId = `dash-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
    const checksum = createHash('sha256')
      .update(JSON.stringify({ dashboardId, name, type }))
      .digest('hex');
    const dashboard = Object.freeze({ dashboardId, name, type, checksum });
    this.dashboards.set(dashboardId, dashboard);
    return dashboardId;
  }

  get(dashboardId: string) {
    return this.dashboards.get(dashboardId);
  }

  getAll() {
    return Array.from(this.dashboards.values());
  }
}

export class RemoteManagementCoordinator {
  private commands = new Map<
    string,
    { commandId: string; action: string; target: string; checksum: string }
  >();

  execute(action: string, target: string): string {
    const commandId = `rmc-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
    const checksum = createHash('sha256')
      .update(JSON.stringify({ commandId, action, target }))
      .digest('hex');
    const command = Object.freeze({ commandId, action, target, checksum });
    this.commands.set(commandId, command);
    return commandId;
  }

  get(commandId: string) {
    return this.commands.get(commandId);
  }

  getAll() {
    return Array.from(this.commands.values());
  }
}
