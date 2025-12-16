import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RemoveIcon from '@mui/icons-material/Remove';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import { useEffect, useState } from 'react';
import { preservePrefix } from '../../../../shared/utils/version-prefix';
import { useVscode } from '../../../hooks/use-vscode';
import type NpmPackageService from '../../../services/npm-provider';
import type { PackageVersion } from '../../../services/npm-provider';
import useStore from '../../../store/store';

/* -------------------------------------------------------------------------- */
/*                              Helper Components                             */
/* -------------------------------------------------------------------------- */

const colorMap: Record<string, string> = {
  major: 'var(--vscode-editorError-foreground)',
  minor: 'var(--vscode-editorWarning-foreground)',
  patch: 'var(--vscode-editorInfo-foreground)',
};

interface VersionInfo {
  version: string;
  major: number;
  minor: number;
  patch: number;
  updateType: string;
}

function ClickableVersion({
  info,
  onClick,
  isUpdating,
}: {
  info: VersionInfo;
  onClick: () => void;
  isUpdating: boolean;
}) {
  if (isUpdating) return <CircularProgress size={14} />;

  const { major, minor, patch, updateType } = info;
  const color = colorMap[updateType];
  const base = 'var(--vscode-foreground)';

  const versionText =
    updateType === 'major' ? (
      <span style={{ color, fontWeight: 500 }}>
        {major}.{minor}.{patch}
      </span>
    ) : updateType === 'minor' ? (
      <span style={{ color: base }}>
        {major}.
        <span style={{ color, fontWeight: 500 }}>
          {minor}.{patch}
        </span>
      </span>
    ) : updateType === 'patch' ? (
      <span style={{ color: base }}>
        {major}.{minor}.<span style={{ color, fontWeight: 500 }}>{patch}</span>
      </span>
    ) : (
      <span style={{ color: base }}>
        {major}.{minor}.{patch}
      </span>
    );

  return (
    <Box
      component="span"
      role="button"
      tabIndex={0}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          e.stopPropagation();
          onClick();
        }
      }}
      title={`Install ${info.version}`}
      sx={{
        cursor: 'pointer',
        borderRadius: '2px',
        paddingBlock: '3px',
        fontWeight: 500,
        '&:hover': {
          backgroundColor: 'var(--vscode-extensionButton-prominentHoverBackground)',
          boxShadow:
            '-5px 0 0 0 var(--vscode-extensionButton-prominentHoverBackground), 5px 0 0 0 var(--vscode-extensionButton-prominentHoverBackground)',
        },
        '&:hover *': {
          color: 'var(--vscode-extensionButton-prominentForeground) !important',
        },
      }}
    >
      {versionText}
    </Box>
  );
}

const UpToDateIcon = () => (
  <CheckCircleIcon
    sx={{ fill: 'var(--vscode-activityBarBadge-background)', fontSize: '1.25rem' }}
  />
);

const PinnedIcon = () => (
  <RemoveIcon
    sx={{ fill: 'var(--vscode-descriptionForeground)', fontSize: '1rem', opacity: 0.5 }}
  />
);

/* -------------------------------------------------------------------------- */
/*                              Custom Hook                                   */
/* -------------------------------------------------------------------------- */

interface VersionState {
  version?: PackageVersion;
  isPending: boolean;
}

export function useVersionData(name: string, npmProvider: NpmPackageService): VersionState {
  const [state, setState] = useState<VersionState>({
    version: undefined,
    isPending: true,
  });

  useEffect(() => {
    let mounted = true;
    npmProvider.getPackageData(name).then((data) => {
      if (mounted) setState({ version: data?.version, isPending: false });
    });
    return () => {
      mounted = false;
    };
  }, [name, npmProvider]);

  return state;
}

/* -------------------------------------------------------------------------- */
/*                              Main Component                                */
/* -------------------------------------------------------------------------- */

type VersionCellType = 'inRange' | 'latest';

interface VersionCellProps {
  name: string;
  npmProvider: NpmPackageService;
  type: VersionCellType;
  /** Original version specifier from package.json (e.g., "^1.0.0", "~1.0.0") */
  currentVersionSpec?: string;
  /** If true, renders without Box wrapper (for inline use) */
  inline?: boolean;
}

/**
 * Displays a single version cell (inRange or latest).
 * Used to show available package updates in the accordion.
 */
export function VersionCell({
  name,
  npmProvider,
  type,
  currentVersionSpec,
  inline = false,
}: VersionCellProps) {
  const { updatePackageToVersion } = useVscode();
  const { version, isPending } = useVersionData(name, npmProvider);

  const updatingPackages = useStore((s) => s.updatingPackages);
  const addUpdatingPackage = useStore((s) => s.addUpdatingPackage);
  const isUpdating = updatingPackages.has(name);

  const update = (targetVersion: string) => {
    addUpdatingPackage(name);
    // Preserve the original range prefix (^, ~, or exact) when updating
    const versionWithPrefix = currentVersionSpec
      ? preservePrefix(currentVersionSpec, targetVersion)
      : targetVersion;
    updatePackageToVersion(name, versionWithPrefix);
  };

  // Loading
  if (isPending) {
    return <CircularProgress size={inline ? 14 : 18} />;
  }

  // No data
  if (!version) {
    return <>—</>;
  }

  // Up to date
  if (version.isUpToDate) {
    return <UpToDateIcon />;
  }

  // For pinned versions: inRange shows "—", latest shows clickable version
  if (version.isPinned) {
    if (type === 'inRange') {
      return <PinnedIcon />;
    }
    // For latest: show clickable version if available
    if (version.latest) {
      return (
        <ClickableVersion
          info={version.latest}
          onClick={() => update(version.latest!.version)}
          isUpdating={isUpdating}
        />
      );
    }
    return <UpToDateIcon />;
  }

  // Get the target version based on type
  const targetVersion = type === 'inRange' ? version.inRange : version.latest;

  // inRange type specific: if no inRange version, show nothing (arrow will be hidden in parent)
  if (type === 'inRange' && !targetVersion) {
    return null;
  }

  // latest type: if no latest (shouldn't happen normally), show up-to-date icon
  if (!targetVersion) {
    return <UpToDateIcon />;
  }

  return (
    <ClickableVersion
      info={targetVersion}
      onClick={() => update(targetVersion.version)}
      isUpdating={isUpdating}
    />
  );
}
