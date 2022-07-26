export interface JvmSpecInfo {
  name: string;
  version: string;
  vendor: string;
}

export interface JvmInfo extends JvmSpecInfo {
  info: string;
}

export type JavaSpecInfo = JvmSpecInfo;

export interface JavaInfo {
  version: string;
  vendor: string;
  vendorUrl: string;
}

export interface JavaRuntimeInfo {
  name: string;
  version: string;
  homeDir: string;
  extDirs: string;
  endorsedDirs: string;
  classPath: string;
  classVersion: string;
  libraryPath: string;
  protocolPackages: string;
}

export interface OsInfo {
  arch: string;
  name: string;
  version: string;
  fileSeparator: string;
  lineSeparator: string;
  pathSeparator: string;
}

export interface UserInfo {
  name: string;
  homeDir: string;
  currentDir: string;
  tempDir: string;
  language: string;
  country: string;
}

export interface HostInfo {
  name: string;
  address: string;
}

export interface RuntimeInfo {
  // 获得JVM最大内存，最大内存
  maxMemory: number;
  // 获得JVM已分配内存，已分配内存
  totalMemory: number;
  // 获得JVM已分配内存中的剩余空间，已分配内存中的剩余空间
  freeMemory: number;
  // 获得JVM最大可用内存，最大可用内存;
  usableMemory: number;
}
