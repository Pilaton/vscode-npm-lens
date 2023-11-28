import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { Box, CircularProgress } from "@mui/material";
import { useEffect, useState } from "react";

import { type IPackageData } from "../../../providers/npm-provider";

import type NPM from "../../../providers/npm-provider";

interface IVersionState {
  version?: IPackageData["version"];
  isPending: boolean;
}

function VersionStatusBadge({
  version,
}: {
  version?: IPackageData["version"];
}) {
  if (!version) {
    return (
      <CheckCircleIcon
        sx={{
          fill: "var(--vscode-activityBarBadge-background)",
          fontSize: "1.25rem",
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
      major: { ...baseStyle, color: "var(--vscode-editorError-foreground)" },
      minor: { ...baseStyle, color: "var(--vscode-editorWarning-foreground)" },
      patch: { ...baseStyle, color: "var(--vscode-editorInfo-foreground)" },
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
  npmProvider: NPM;
}) {
  const [version, setVersion] = useState<IVersionState>({
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

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [name, npmProvider]);

  return (
    <Box sx={{ letterSpacing: "0.75px" }}>
      {version.isPending ? (
        <CircularProgress size={18} />
      ) : (
        <VersionStatusBadge version={version?.version} />
      )}
    </Box>
  );
}
