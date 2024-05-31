import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { Box, Button, CircularProgress } from '@mui/material';
import { useEffect, useState } from 'react';
import type { MessageListener } from 'src/controllers/web-view-panel';
import type { PackageData } from '../../../providers/npm-provider';
import type NPM from '../../../providers/npm-provider';

interface VersionState {
  version?: PackageData['version'];
  isPending: boolean;
}

function VersionStatusBadge({
  version,
}: {
  version?: PackageData['version'];
}) {
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

const handleUpdatePackage = (packageName: string) => {
  const { vscode } = window;
  // eslint-disable-next-line @typescript-eslint/no-floating-promises
  vscode.postMessage({
    command: 'updatePackage',
    packageName,
  } satisfies MessageListener);
};

export default function VersionStatus({
  name,
  npmProvider,
}: {
  name: string;
  npmProvider: NPM;
}) {
  const [version, setVersion] = useState<VersionState>({
    version: undefined,
    isPending: true,
  });

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
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    fetchData();

    return () => {
      isMounted = false;
    };
  }, [name, npmProvider]);

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
            onClick={() => {
              handleUpdatePackage(name);
            }}
          >
            Update
          </Button>
        )}
      </Box>
    </>
  );
}
