import { coerce, diff, gt, maxSatisfying, type ReleaseType, satisfies, validRange } from 'semver';
import type { Dependencies } from '../../extension/utils/get-package-json';
import type { WebviewMessage } from '../../shared/types/messages';
import { parseVersionSpec } from '../../shared/utils/version-prefix';

/** Version info for a single update option */
interface VersionInfo {
  version: string;
  major: number;
  minor: number;
  patch: number;
  updateType: ReleaseType;
}

/** Package version data with in-range and latest options */
export interface PackageVersion {
  /** Maximum version within the semver range (null if latest is within range) */
  inRange: VersionInfo | null;
  /** Latest available version on npm */
  latest: VersionInfo | null;
  /** True if version is pinned (exact, no ^~) */
  isPinned: boolean;
  /** True if current version equals latest */
  isUpToDate: boolean;
  /** True if version format is supported (^, ~, or exact). False for wildcards, complex ranges, tags, etc. */
  isSupported: boolean;
}

export interface PackageData {
  name: string;
  description: string;
  version: PackageVersion;
  npmUrl: string;
  repositoryUrl: string;
  lastPublish: string;
  license: string;
  size: number | undefined;
  deprecated?: string;
}

export type PackageDataAsync = Promise<PackageData | null>;

interface NpmRegistryResponse {
  name: string;
  description: string;
  'dist-tags': { latest: string };
  repository: { url: string };
  time: { modified: string };
  license: string;
  versions: Record<
    string,
    {
      deprecated?: string;
      dist: {
        unpackedSize?: number | undefined;
      };
    }
  >;
}

/* -------------------------------------------------------------------------- */

const GITHUB_URL_REGEX = /github\.com.*(?=\.git)/;

const formatRepoUrl = (repoUrl: string): string => {
  const match = repoUrl.match(GITHUB_URL_REGEX);
  return match ? `https://${match[0]}` : '';
};

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const day = date.toLocaleString('en-US', { day: '2-digit' });
  const month = date.toLocaleString('en-US', { month: 'long' });
  const year = date.toLocaleString('en-US', { year: 'numeric' });

  return `${day} ${month} ${year}`;
};

/* -------------------------------------------------------------------------- */

export default class NpmPackageService {
  #packages: Record<string, PackageDataAsync> = {};

  constructor(dependencies: Dependencies) {
    this.#init(dependencies);
  }

  getPackageData(packageName: string): PackageDataAsync {
    return this.#packages[packageName];
  }

  getAllPackagesData(): Record<string, PackageDataAsync> {
    return this.#packages;
  }

  async fetchPackageData(packageName: string): Promise<NpmRegistryResponse | null> {
    try {
      const response = await fetch(`https://registry.npmjs.org/${packageName}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch data for ${packageName}`);
      }
      return (await response.json()) as NpmRegistryResponse;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  #init(dependencies: Dependencies) {
    for (const [packageName, version] of Object.entries(dependencies)) {
      this.#packages[packageName] = this.#getPackage(packageName, version);
    }
  }

  async #getPackage(packageName: string, currentVersion: string): PackageDataAsync {
    const parsedData = await this.fetchPackageData(packageName);
    if (!parsedData) {
      return null;
    }

    return this.#processPackageData(currentVersion, parsedData);
  }

  #processPackageData(versionRange: string, parsedData: NpmRegistryResponse): PackageData | null {
    try {
      const latestVersion = parsedData['dist-tags'].latest;
      const allVersions = Object.keys(parsedData.versions);
      const packageInfo = parsedData.versions[latestVersion];

      const versionData = this.#calculateVersions(versionRange, latestVersion, allVersions);

      const repositoryUrl =
        typeof parsedData?.repository === 'string'
          ? parsedData?.repository
          : parsedData?.repository?.url;

      return {
        name: parsedData.name,
        description: parsedData.description ?? '?',
        version: versionData,
        npmUrl: `https://npmjs.com/package/${parsedData.name}`,
        repositoryUrl: repositoryUrl ? formatRepoUrl(repositoryUrl) : '',
        lastPublish: formatDate(parsedData.time.modified),
        license: parsedData.license,
        size: packageInfo.dist?.unpackedSize,
        deprecated: packageInfo.deprecated,
      };
    } catch (error) {
      console.error('Error processing package data:', error);
      window.vscode.postMessage({
        command: 'alert',
        type: 'error',
        text: '«NPM» domain not available',
      } satisfies WebviewMessage);

      return null;
    }
  }

  #calculateVersions(
    versionRange: string,
    latestVersion: string,
    allVersions: string[]
  ): PackageVersion {
    const { isPinned, isSupported } = parseVersionSpec(versionRange);

    if (!isSupported) {
      return {
        inRange: null,
        latest: null,
        isPinned: false,
        isUpToDate: false,
        isSupported: false,
      };
    }

    const currentVersion = coerce(versionRange, { includePrerelease: true });
    const latestCoerced = coerce(latestVersion, { includePrerelease: true });

    const isUpToDate =
      currentVersion && latestCoerced ? !gt(latestCoerced.version, currentVersion.version) : true;

    if (isUpToDate) {
      return {
        inRange: null,
        latest: null,
        isPinned,
        isUpToDate: true,
        isSupported: true,
      };
    }

    const latestInfo = this.#createVersionInfo(currentVersion?.version ?? '0.0.0', latestVersion);

    // Pinned versions: show latest only (no inRange)
    if (isPinned) {
      return {
        inRange: null,
        latest: latestInfo,
        isPinned: true,
        isUpToDate: false,
        isSupported: true,
      };
    }

    const range = validRange(versionRange);
    const latestSatisfiesRange = range ? satisfies(latestVersion, range) : false;

    if (latestSatisfiesRange) {
      return {
        inRange: null,
        latest: latestInfo,
        isPinned: false,
        isUpToDate: false,
        isSupported: true,
      };
    }

    const inRangeVersion = range ? maxSatisfying(allVersions, range) : null;
    const currentCoercedVersion = currentVersion?.version ?? '0.0.0';
    const inRangeInfo =
      inRangeVersion && gt(inRangeVersion, currentCoercedVersion)
        ? this.#createVersionInfo(currentCoercedVersion, inRangeVersion)
        : null;

    return {
      inRange: inRangeInfo,
      latest: latestInfo,
      isPinned: false,
      isUpToDate: false,
      isSupported: true,
    };
  }

  #createVersionInfo(currentVersion: string, targetVersion: string): VersionInfo | null {
    const target = coerce(targetVersion, { includePrerelease: true });
    if (!target) return null;

    const updateType = diff(currentVersion, target.version);
    if (!updateType) return null;

    return {
      version: target.version,
      major: target.major,
      minor: target.minor,
      patch: target.patch,
      updateType,
    };
  }
}
