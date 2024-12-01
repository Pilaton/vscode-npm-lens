import { type ReleaseType, coerce, diff } from 'semver';
import type { MessageListener } from 'src/controllers/web-view-panel';
import type { Dependencies } from 'src/utils/get-package-json';

export interface PackageData {
  name: string;
  description: string;
  version?: PackageVersion;
  npmUrl: string;
  repositoryUrl: string;
  lastPublish: string;
  license: string;
  size: number | undefined;
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
      dist: {
        unpackedSize?: number | undefined;
      };
    }
  >;
}

interface PackageVersion {
  updateType: ReleaseType;
  major: number;
  minor: number;
  patch: number;
  version: string;
}
/* -------------------------------------------------------------------------- */

const REGEX = /github\.com.*(?=\.git)/;

const formatRepoUrl = (repoUrl: string): string => {
  const match = repoUrl.match(REGEX);
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

export default class Npm {
  #packages: Record<string, PackageDataAsync> = {};

  constructor(dependencies: Dependencies) {
    this.#init(dependencies);
  }

  getPackageData(packageName: string): PackageDataAsync {
    return this.#packages[packageName];
  }

  getDataAllPackages(): Record<string, PackageDataAsync> {
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

  #processPackageData(currentVersion: string, parsedData: NpmRegistryResponse): PackageData | null {
    try {
      const latestVersion = parsedData['dist-tags'].latest;

      const packageInfo = parsedData.versions[latestVersion];

      const extendedVersion = this.#convertToExtendedVersion(currentVersion, latestVersion);

      const repositoryUrl =
        typeof parsedData?.repository === 'string'
          ? parsedData?.repository
          : parsedData?.repository?.url;

      return {
        name: parsedData.name,
        description: parsedData.description ?? '?',
        version: extendedVersion,
        npmUrl: `https://npmjs.com/package/${parsedData.name}`,
        repositoryUrl: repositoryUrl ? formatRepoUrl(repositoryUrl) : '',
        lastPublish: formatDate(parsedData.time.modified),
        license: parsedData.license,
        size: packageInfo.dist?.unpackedSize,
      };
    } catch (error) {
      console.error('Error processing package data:', error);
      window.vscode.postMessage({
        command: 'alert',
        type: 'error',
        text: '«NPM» domain not available',
      } satisfies MessageListener);

      return null;
    }
  }

  #convertToExtendedVersion(
    currentVersionProperty: string,
    latestVersion: string
  ): PackageData['version'] {
    const currentVersion = coerce(currentVersionProperty);
    const newVersion = coerce(latestVersion);

    if (!(currentVersion && newVersion)) {
      return undefined;
    }

    const updateType = diff(currentVersion.version, newVersion.version);
    if (!updateType) {
      return undefined;
    }

    return {
      updateType,
      major: newVersion.major,
      minor: newVersion.minor,
      patch: newVersion.patch,
      version: newVersion.version,
    };
  }
}
