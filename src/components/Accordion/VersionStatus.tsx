import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { Box, CircularProgress } from "@mui/material";
import { FC, useEffect, useState } from "react";

import NPM, { IPackageData } from "../../services/npm.controller";

interface IVersionStatusProps {
  props: {
    name: string;
    npmController: NPM;
  };
}

type GetStatus = (newVer: IPackageData["version"]) => JSX.Element;

interface IVersionState {
  version: IPackageData["version"] | null;
  isPending: boolean;
}

const getStatus: GetStatus = (newVer) => {
  if (!newVer) {
    return (
      <CheckCircleIcon
        sx={{
          fill: "var(--vscode-activityBarBadge-background)",
          fontSize: "1.25rem",
        }}
      />
    );
  }

  const { major, minor, patch, updateType } = newVer;

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

const VersionStatus: FC<IVersionStatusProps> = ({
  props: { name, npmController },
}) => {
  const [packageData, setPackageData] = useState<IVersionState>({
    version: null,
    isPending: true,
  });

  useEffect(() => {
    (async () => {
      const res = await npmController.getPackageData(name);
      const version = res && res.version;

      setPackageData({ version, isPending: false });
    })();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [name]);

  return packageData.isPending ? (
    <CircularProgress size={18} />
  ) : (
    <Box sx={{ letterSpacing: "0.75px" }}>{getStatus(packageData.version)}</Box>
  );
};

export default VersionStatus;
