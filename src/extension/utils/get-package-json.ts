import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import getRootPath from './get-root-path';

export type Dependencies = Record<string, string>;

export interface PackageJson {
  dependencies?: Dependencies;
  devDependencies?: Dependencies;
  peerDependencies?: Dependencies;
  bundleDependencies?: Dependencies;
  optionalDependencies?: Dependencies;
}

const getPackageJson = async (): Promise<PackageJson | null> => {
  try {
    const rootUri = getRootPath();
    if (!rootUri) {
      return null;
    }
    const packageJsonPath = join(rootUri.fsPath, 'package.json');

    const packageJsonData = await readFile(packageJsonPath, 'utf8');
    const packageJson = JSON.parse(packageJsonData) as PackageJson;
    return packageJson;
  } catch (error) {
    console.error('Error reading package.json:', error);
    return null;
  }
};

export default getPackageJson;
