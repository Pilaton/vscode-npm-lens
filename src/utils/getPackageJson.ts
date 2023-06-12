import { readFileSync } from "fs";

import { PackageJson } from "../types/global";

import getRootPath from "./getRootPath";

const getPackageJson = (): PackageJson | null => {
  try {
    const rootPath = getRootPath();

    const packageJsonData = readFileSync(`${rootPath}/package.json`, "utf8");
    const packageJson = JSON.parse(packageJsonData) as PackageJson;
    return packageJson;
  } catch (error) {
    return null;
  }
};

export default getPackageJson;
