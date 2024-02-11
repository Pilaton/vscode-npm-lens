import { type PackageManager } from "pubun";

interface UpdateCommandOptions {
  packageManager: PackageManager;
  packageName?: string;
}

const getTerminalUpdateCommand = ({
  packageManager,
  packageName,
}: UpdateCommandOptions) => {
  const commands = {
    bun: packageName ? `bun update ${packageName}` : "bun update --force",
    npm: packageName ? `npm update ${packageName}` : "npm update",
    yarn: packageName
      ? `yarn upgrade ${packageName} --latest`
      : "yarn upgrade --latest",
    pnpm: packageName ? `pnpm up ${packageName} --latest` : "pnpm up --latest",
  } satisfies Record<PackageManager, string>;

  const command = commands[packageManager];

  if (!command) {
    throw new Error(`Unsupported package manager: ${packageManager}`);
  }

  return command;
};

export default getTerminalUpdateCommand;
