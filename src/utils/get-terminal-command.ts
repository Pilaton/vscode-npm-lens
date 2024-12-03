import type { PackageManager } from 'pubun';

export interface TerminalCommandOptions {
  commandType: 'updateAll' | 'update' | 'remove';
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
      bun: `bun update ${packageName} --force`,
      npm: `npm install ${packageName}@latest`,
      yarn: `yarn up ${packageName}`,
      pnpm: `pnpm up ${packageName} --latest`,
    },
    updateAll: {
      bun: 'bun update --force',
      npm: 'npm update',
      yarn: "yarn up '**'",
      pnpm: 'pnpm up --latest',
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
