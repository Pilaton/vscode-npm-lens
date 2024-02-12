import { readFile } from "node:fs/promises";
import { join } from "node:path";
import getRootPath from "./get-root-path";

export type Dependencies = Record<string, string>;

export interface IPackageJson {
  dependencies?: Dependencies;
  devDependencies?: Dependencies;
  peerDependencies?: Dependencies;
  bundleDependencies?: Dependencies;
  optionalDependencies?: Dependencies;
}

const getPackageJson = async (): Promise<IPackageJson | null> => {
  try {
    const rootPath = getRootPath();
    const packageJsonPath = join(rootPath, "package.json");

    const packageJsonData = await readFile(packageJsonPath, "utf8");
    const packageJson = JSON.parse(packageJsonData) as IPackageJson;
    return packageJson;
  } catch (error) {
    console.error("Error reading package.json:", error);
    return null;
  }
};

export default getPackageJson;
