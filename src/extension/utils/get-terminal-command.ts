import type { PackageManager } from 'pubun';

export interface TerminalCommandOptions {
  commandType: 'update' | 'remove';
  packageManager: PackageManager;
  packageName?: string;
  targetVersion?: string; // Optional: specific version to install (e.g., "4.0.9")
}

export const getTerminalCommand = ({
  commandType,
  packageManager,
  packageName,
  targetVersion,
}: TerminalCommandOptions) => {
  // Determine version suffix: @4.0.9 for specific version, @latest for latest
  const versionSuffix = targetVersion ? `@${targetVersion}` : '@latest';

  const commands = {
    update: {
      bun: `bun add ${packageName}${versionSuffix}`,
      npm: `npm install ${packageName}${versionSuffix}`,
      yarn: `yarn add ${packageName}${versionSuffix}`,
      pnpm: `pnpm add ${packageName}${versionSuffix}`,
    },
    remove: {
      bun: `bun remove ${packageName}`,
      npm: `npm uninstall ${packageName}`,
      yarn: `yarn remove ${packageName}`,
      pnpm: `pnpm remove ${packageName}`,
    },
  } satisfies Record<TerminalCommandOptions['commandType'], Record<PackageManager, string>>;

  const command = commands[commandType]?.[packageManager];

  if (!command) {
    throw new Error(`Unsupported package manager: ${packageManager}`);
  }

  return command;
};
