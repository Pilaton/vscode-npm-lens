import { type ReleaseType, coerce, diff } from "semver";
import { type MessageListener } from "src/controllers/web-view-panel";
import { type Dependencies } from "src/utils/get-package-json";

export interface IPackageData {
  name: string;
  description: string;
  version?: IPackageVersion;
  npmUrl: string;
  repositoryUrl: string;
  lastPublish: string;
  license: string;
  size: number | undefined;
}

export type PackageDataAsync = Promise<IPackageData | null>;

interface INpmRegistryResponse {
  name: string;
  description: string;
  "dist-tags": { latest: string };
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

interface IPackageVersion {
  updateType: ReleaseType;
  major: number;
  minor: number;
  patch: number;
  version: string;
}
/* -------------------------------------------------------------------------- */

const formatRepoUrl = (repoUrl: string): string => {
  const match = repoUrl.match(/github\.com.*(?=\.git)/);
  return match ? `https://${match[0]}` : "";
};

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const day = date.toLocaleString("en-US", { day: "2-digit" });
  const month = date.toLocaleString("en-US", { month: "long" });
  const year = date.toLocaleString("en-US", { year: "numeric" });

  return `${day} ${month} ${year}`;
};
/* -------------------------------------------------------------------------- */

class NPM {
  #packages: Record<string, PackageDataAsync> = {};

  constructor(dependencies: Dependencies) {
    this.#init(dependencies);
  }

  async getPackageData(packageName: string): PackageDataAsync {
    return this.#packages[packageName];
  }

  getDataAllPackages(): Record<string, PackageDataAsync> {
    return this.#packages;
  }

  async fetchPackageData(
    packageName: string,
  ): Promise<INpmRegistryResponse | null> {
    try {
      const response = await fetch(`https://registry.npmjs.org/${packageName}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch data for ${packageName}`);
      }
      return (await response.json()) as INpmRegistryResponse;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  #init(dependencies: Dependencies) {
    Object.entries(dependencies).forEach(([packageName, version]) => {
      this.#packages[packageName] = this.#getPackage(packageName, version);
    });
  }

  async #getPackage(
    packageName: string,
    currentVersion: string,
  ): PackageDataAsync {
    const parsedData = await this.fetchPackageData(packageName);
    if (!parsedData) return null;

    return this.#processPackageData(currentVersion, parsedData);
  }

  #processPackageData(
    currentVersion: string,
    parsedData: INpmRegistryResponse,
  ): IPackageData | null {
    try {
      const latestVersion = parsedData["dist-tags"].latest;

      const packageInfo = parsedData.versions[latestVersion];

      const extendedVersion = this.#convertToExtendedVersion(
        currentVersion,
        latestVersion,
      );

      if (!extendedVersion) return null;

      const repositoryUrl =
        typeof parsedData?.repository === "string"
          ? parsedData?.repository
          : parsedData?.repository?.url;

      return {
        name: parsedData.name,
        description: parsedData.description ?? "?",
        version: extendedVersion,
        npmUrl: `https://npmjs.com/package/${parsedData.name}`,
        repositoryUrl: repositoryUrl ? formatRepoUrl(repositoryUrl) : "",
        lastPublish: formatDate(parsedData.time.modified),
        license: parsedData.license,
        size: packageInfo.dist?.unpackedSize,
      };
    } catch (error) {
      console.error("Error processing package data:", error);
      window.vscode.postMessage({
        command: "alert",
        type: "error",
        text: "«NPM» domain not available",
      } satisfies MessageListener);

      return null;
    }
  }

  #convertToExtendedVersion(
    currentVersionProperty: string,
    latestVersion: string,
  ): IPackageData["version"] {
    const currentVersion = coerce(currentVersionProperty);
    const newVersion = coerce(latestVersion);
    if (!currentVersion || !newVersion) return undefined;

    const updateType = diff(currentVersion.version, newVersion.version);
    if (!updateType) return undefined;

    return {
      updateType,
      major: newVersion.major,
      minor: newVersion.minor,
      patch: newVersion.patch,
      version: newVersion.version,
    };
  }
}

export default NPM;
