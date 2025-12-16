import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import type NpmPackageService from '../../../services/npm-provider';
import { useVersionData, VersionCell } from './version-status';

interface CurrentWithInRangeProps {
  name: string;
  currentVersion: string;
  /** Original version specifier from package.json for preserving prefix */
  currentVersionSpec: string;
  npmProvider: NpmPackageService;
}

/**
 * Displays current version with arrow and inRange version if available.
 * Format: "1.0.0 → 1.2.0" or just "1.0.0" if no inRange update.
 */
export function CurrentWithInRange({
  name,
  currentVersion,
  currentVersionSpec,
  npmProvider,
}: CurrentWithInRangeProps) {
  const { version, isPending } = useVersionData(name, npmProvider);

  // Determine if we should show the arrow and inRange version
  const showArrow =
    !isPending && version && !version.isPinned && !version.isUpToDate && version.inRange;

  return (
    <>
      {currentVersion}
      {showArrow && (
        <>
          <ArrowForwardIcon sx={{ fontSize: '0.875rem', opacity: 0.5 }} />
          <VersionCell
            name={name}
            npmProvider={npmProvider}
            type="inRange"
            currentVersionSpec={currentVersionSpec}
            inline
          />
        </>
      )}
    </>
  );
}
