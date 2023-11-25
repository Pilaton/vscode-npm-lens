import { readFileSync } from "node:fs";

import { PackageJson } from "../types/global";

import getRootPath from "./get-root-path";

const getPackageJson = (): PackageJson | null => {
  try {
    const rootPath = getRootPath();

    const packageJsonData = readFileSync(`${rootPath}/package.json`, "utf8");
    const packageJson = JSON.parse(packageJsonData) as PackageJson;
    return packageJson;
  } catch {
    return null;
  }
};

export default getPackageJson;
