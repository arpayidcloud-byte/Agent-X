import { createHash } from 'crypto';

export interface MarketplaceListing {
  readonly listingId: string;
  readonly name: string;
  readonly type: 'PLUGIN' | 'EXTENSION' | 'PACKAGE' | 'ARTIFACT';
  readonly version: string;
  readonly author: string;
  readonly checksum: string;
}

export class PluginMarketplace {
  private listings = new Map<string, MarketplaceListing>();

  list(name: string, version: string, author: string): MarketplaceListing {
    const listingId = `pm-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
    const checksum = createHash('sha256')
      .update(JSON.stringify({ listingId, name, version, author }))
      .digest('hex');
    const listing: MarketplaceListing = Object.freeze({
      listingId,
      name,
      type: 'PLUGIN',
      version,
      author,
      checksum,
    });
    this.listings.set(listingId, listing);
    return listing;
  }

  get(listingId: string): MarketplaceListing | undefined {
    return this.listings.get(listingId);
  }

  getAll(): MarketplaceListing[] {
    return Array.from(this.listings.values());
  }
}

export class ExtensionMarketplace {
  private listings = new Map<string, MarketplaceListing>();

  list(name: string, version: string, author: string): MarketplaceListing {
    const listingId = `em-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
    const checksum = createHash('sha256')
      .update(JSON.stringify({ listingId, name, version, author }))
      .digest('hex');
    const listing: MarketplaceListing = Object.freeze({
      listingId,
      name,
      type: 'EXTENSION',
      version,
      author,
      checksum,
    });
    this.listings.set(listingId, listing);
    return listing;
  }

  get(listingId: string): MarketplaceListing | undefined {
    return this.listings.get(listingId);
  }

  getAll(): MarketplaceListing[] {
    return Array.from(this.listings.values());
  }
}

export class PackageMarketplace {
  private listings = new Map<string, MarketplaceListing>();

  list(name: string, version: string, author: string): MarketplaceListing {
    const listingId = `pkmg-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
    const checksum = createHash('sha256')
      .update(JSON.stringify({ listingId, name, version, author }))
      .digest('hex');
    const listing: MarketplaceListing = Object.freeze({
      listingId,
      name,
      type: 'PACKAGE',
      version,
      author,
      checksum,
    });
    this.listings.set(listingId, listing);
    return listing;
  }

  get(listingId: string): MarketplaceListing | undefined {
    return this.listings.get(listingId);
  }

  getAll(): MarketplaceListing[] {
    return Array.from(this.listings.values());
  }
}

export interface ArtifactRepoEntry {
  readonly artifactId: string;
  readonly name: string;
  readonly type: string;
  readonly size: number;
  readonly checksum: string;
}

export class ArtifactRepository {
  private artifacts = new Map<string, ArtifactRepoEntry>();

  upload(name: string, type: string, size: number): ArtifactRepoEntry {
    const artifactId = `ar-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
    const checksum = createHash('sha256')
      .update(JSON.stringify({ artifactId, name, type, size }))
      .digest('hex');
    const entry: ArtifactRepoEntry = Object.freeze({ artifactId, name, type, size, checksum });
    this.artifacts.set(artifactId, entry);
    return entry;
  }

  get(artifactId: string): ArtifactRepoEntry | undefined {
    return this.artifacts.get(artifactId);
  }

  delete(artifactId: string): boolean {
    return this.artifacts.delete(artifactId);
  }

  getAll(): ArtifactRepoEntry[] {
    return Array.from(this.artifacts.values());
  }
}
