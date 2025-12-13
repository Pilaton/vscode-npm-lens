import type { PackageManager } from 'pubun';

export interface TerminalCommandOptions {
  commandType: 'update' | 'remove';
  packageManager: PackageManager;
  packageName?: string;
}

export const getTerminalCommand = ({
  commandType,
  packageManager,
  packageName,
}: TerminalCommandOptions) => {
  const commands = {
    update: {
      // Single package: install latest version
      bun: `bun add ${packageName}@latest`,
      npm: `npm install ${packageName}@latest`,
      yarn: `yarn add ${packageName}@latest`,
      pnpm: `pnpm add ${packageName}@latest`,
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
