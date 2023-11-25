import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { Box, CircularProgress } from "@mui/material";
import { useEffect, useState } from "react";

import NPM, { IPackageData } from "../../../providers/npm-provider";

interface IVersionStatusProperties {
  props: {
    name: string;
    npmProvider: NPM;
  };
}

type GetStatus = (newVersion: IPackageData["version"]) => JSX.Element;

interface IVersionState {
  version: IPackageData["version"] | null;
  isPending: boolean;
}

const getStatus: GetStatus = (newVersion) => {
  if (!newVersion) {
    return (
      <CheckCircleIcon
        sx={{
          fill: "var(--vscode-activityBarBadge-background)",
          fontSize: "1.25rem",
        }}
      />
    );
  }

  const { major, minor, patch, updateType } = newVersion;

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

  return status[updateType];
};

function VersionStatus({
  props: { name, npmProvider },
}: IVersionStatusProperties) {
  const [packageData, setPackageData] = useState<IVersionState>({
    version: null,
    isPending: true,
  });

  useEffect(() => {
    (async () => {
      const result = await npmProvider.getPackageData(name);
      const version = result && result.version;

      setPackageData({ version, isPending: false });
    })();
  }, [name]);

  return packageData.isPending ? (
    <CircularProgress size={18} />
  ) : (
    <Box sx={{ letterSpacing: "0.75px" }}>{getStatus(packageData.version)}</Box>
  );
}

export default VersionStatus;
