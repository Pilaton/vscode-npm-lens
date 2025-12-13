import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import { useEffect, useState } from 'react';
import { useVscode } from '../../hooks/use-vscode';
import type NpmPackageService from '../../services/npm-provider';
import type { PackageData } from '../../services/npm-provider';
import useStore from '../../store/store';

interface VersionState {
  version?: PackageData['version'];
  isPending: boolean;
}

function VersionStatusBadge({ version }: { version?: PackageData['version'] }) {
  if (!version) {
    return (
      <CheckCircleIcon
        sx={{
          fill: 'var(--vscode-activityBarBadge-background)',
          fontSize: '1.25rem',
        }}
      />
    );
  }

  const { major, minor, patch, updateType, version: fullVersion } = version;
  const allowedTypes: Record<string, boolean> = {
    major: true,
    minor: true,
    patch: true,
  };

  if (updateType in allowedTypes) {
    const baseStyle = { fontWeight: 500 };
    const styles = {
      major: { ...baseStyle, color: 'var(--vscode-editorError-foreground)' },
      minor: { ...baseStyle, color: 'var(--vscode-editorWarning-foreground)' },
      patch: { ...baseStyle, color: 'var(--vscode-editorInfo-foreground)' },
    };

    const status = {
      major: (
        <span style={styles.major}>
          {major}.{minor}.{patch}
        </span>
      ),
      minor: (
        <>
          {major}.
          <span style={styles.minor}>
            {minor}.{patch}
          </span>
        </>
      ),
      patch: (
        <>
          {major}.{minor}.<span style={styles.patch}>{patch}</span>
        </>
      ),
    };

    return status[updateType as keyof typeof status];
  }

  return fullVersion;
}

export default function VersionStatus({
  name,
  npmProvider,
}: {
  name: string;
  npmProvider: NpmPackageService;
}) {
  const { updatePackage } = useVscode();
  const [version, setVersion] = useState<VersionState>({
    version: undefined,
    isPending: true,
  });

  // Global store: which packages are currently in update queue
  const updatingPackages = useStore((state) => state.updatingPackages);
  const addUpdatingPackage = useStore((state) => state.addUpdatingPackage);

  const isThisUpdating = updatingPackages.has(name);

  useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      const data = await npmProvider.getPackageData(name);
      if (isMounted) {
        setVersion({
          version: data?.version,
          isPending: false,
        });
      }
    };
    fetchData();

    return () => {
      isMounted = false;
    };
  }, [name, npmProvider]);

  const handleUpdate = (event: React.MouseEvent) => {
    event.stopPropagation();
    addUpdatingPackage(name);
    updatePackage(name);
  };

  return (
    <>
      <Box sx={{ width: '20%', textAlign: 'right', letterSpacing: '0.75px' }}>
        {version.isPending ? (
          <CircularProgress size={18} />
        ) : (
          <VersionStatusBadge version={version?.version} />
        )}
      </Box>

      <Box sx={{ width: '10%', textAlign: 'right' }}>
        {version?.version && (
          <Button
            sx={{ marginInlineStart: '1rem' }}
            size="small"
            variant="outlined"
            onClick={handleUpdate}
            loading={isThisUpdating}
          >
            Update
          </Button>
        )}
      </Box>
    </>
  );
}
