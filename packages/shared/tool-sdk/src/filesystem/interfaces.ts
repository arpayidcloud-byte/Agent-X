export interface FileMetadata {
  size: number;
  createdAt: Date;
  updatedAt: Date;
  isDirectory: boolean;
  isFile: boolean;
  isSymlink: boolean;
}

export interface FilesystemConfig {
  allow: string[];
  allowedReadPatterns?: string[];
  allowedWritePatterns?: string[];
  maxFileSizeBytes: number;
  allowHiddenFiles: boolean;
}

export interface IPathResolver {
  resolve(workspaceRoot: string, requestPath: string): Promise<string>;
  canonicalize(rawPath: string): string;
  detectTraversal(rawPath: string): void;
  resolveRealPath(absolutePath: string): Promise<string>;
  rejectInvalidPaths(rawPath: string): void;
}

export interface ISandbox {
  readonly workspaceRoot: string;
  validateRead(requestPath: string): Promise<string>;
  validateWrite(requestPath: string): Promise<string>;
  validateWorkspaceJail(realPath: string): void;
  validateSymlinkEscape(realPath: string): void;
  validateAllowlist(realPath: string): void;
  validateHiddenFilePolicy(realPath: string): void;
}

export interface IFilesystemPolicy {
  getConfig(): FilesystemConfig;
  isAllowed(realPath: string): boolean;
  validateFileSize(sizeBytes: number): void;
}

export interface IAtomicWriter {
  write(filePath: string, content: string): Promise<void>;
  rollback(tempFilePath: string): Promise<void>;
}

export interface IFilesystemValidator {
  validateEncoding(buffer: Buffer): boolean;
  detectBinary(buffer: Buffer): boolean;
}
