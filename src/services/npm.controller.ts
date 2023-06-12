import { coerce, diff } from "semver";

import { Dependencies } from "../types/global";

export interface IPackageData {
  name: string;
  description: string;
  version: IExtendedVersion | null;
  npmUrl: string;
  repositoryUrl: string;
  lastPublish: string;
  license: string;
  size: number | undefined;
}

interface INpmRegistryResponse {
  name: string;
  description: string;
  "dist-tags": { latest: string };
  repository: { url: string };
  time: { modified: string };
  license: string;
  versions: {
    [ver: string]: {
      dist: {
        unpackedSize?: number | undefined;
      };
    };
  };
}

interface ICoerceVersion {
  major: number;
  minor: number;
  patch: number;
  version: string;
}
export interface IExtendedVersion extends ICoerceVersion {
  updateType: "major" | "minor" | "patch";
}

export type PackageDataAsync = Promise<IPackageData | null>;

type ConvertToExtendedVersion = (
  args: Record<string, string>
) => IPackageData["version"];

/* -------------------------------------------------------------------------- */

const formatRepoUrl = (repoUrl: string): string => {
  const match = repoUrl.match(/github\.com.*(?=\.git)/);
  return match ? `https://${match[0]}` : "";
};

const formatDate = (dateStr: string): string => {
  const date = new Date(dateStr);
  const day = date.toLocaleString("en-US", { day: "2-digit" });
  const month = date.toLocaleString("en-US", { month: "long" });
  const year = date.toLocaleString("en-US", { year: "numeric" });

  return `${day} ${month} ${year}`;
};
/* -------------------------------------------------------------------------- */

class NPM {
  private packages: Record<string, PackageDataAsync> = {};

  constructor(deps: Dependencies) {
    this.init(deps);
  }

  private init(packages: Dependencies) {
    Object.entries(packages).forEach(([packageName, version]) => {
      this.packages[packageName] = NPM.getPackage(packageName, version);
    });
  }

  private static async getPackage(
    packageName: string,
    currentVersion: string
  ): PackageDataAsync {
    try {
      const response = await fetch(`https://registry.npmjs.org/${packageName}`);

      const parsedData = (await response.json()) as INpmRegistryResponse;

      const latestVersion = parsedData["dist-tags"].latest;

      return {
        name: parsedData.name,
        description: parsedData.description,
        version: this.convertToExtendedVersion({
          currentVersion,
          latestVersion,
        }),
        npmUrl: `https://npmjs.com/package/${parsedData.name}`,
        repositoryUrl: formatRepoUrl(parsedData.repository.url),
        lastPublish: formatDate(parsedData.time.modified),
        license: parsedData.license,
        size: parsedData.versions[latestVersion].dist?.unpackedSize,
      };
    } catch (err) {
      window.vscode.postMessage({
        type: "error",
        text: "«NPM» domain not available",
      });
      return null;
    }
  }

  private static convertToExtendedVersion: ConvertToExtendedVersion = ({
    currentVersion,
    latestVersion,
  }) => {
    /* eslint-disable @typescript-eslint/no-non-null-assertion */
    const curVersion: ICoerceVersion = coerce(currentVersion)!;
    const newVersion: ICoerceVersion = coerce(latestVersion)!;
    /* eslint-enable @typescript-eslint/no-non-null-assertion */

    const checker = diff(
      curVersion.version,
      newVersion.version
    ) as IExtendedVersion["updateType"];

    if (!checker) return null;

    const { major, minor, patch, version } = newVersion;

    return {
      updateType: checker,
      major,
      minor,
      patch,
      version,
    };
  };

  async getPackageData(packageName: string): PackageDataAsync {
    return this.packages[packageName];
  }

  getDataAllPackages(): Record<string, PackageDataAsync> {
    return this.packages;
  }
}

export default NPM;
