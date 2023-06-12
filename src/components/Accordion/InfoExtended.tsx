import GitHubIcon from "@mui/icons-material/GitHub";
import {
  Box,
  Button,
  Divider,
  Stack,
  SvgIcon,
  Tooltip,
  Typography,
} from "@mui/material";
import prettyBytes from "pretty-bytes";
import { ComponentProps, FC, useEffect, useState } from "react";

import BundlephobiaIcon from "../../assets/bundlephobia.svg";
import NpmIcon from "../../assets/npm.svg";
import { BundleData } from "../../services/bundlephobia.controller";
import { IPackageData } from "../../services/npm.controller";
import useStore from "../../store/store";

/* -------------------------------------------------------------------------- */

interface IDetailBlock extends ComponentProps<typeof Stack> {
  label: string;
  value: string | number | JSX.Element;
  title?: string;
}

/* -------------------------------------------------------------------------- */

export const DetailBlock: FC<IDetailBlock> = ({
  label,
  value,
  title,
  ...props
}) => (
  <Tooltip title={title || ""} arrow placement="top" enterDelay={50}>
    <Stack spacing={0.5} {...props}>
      <Box sx={{ opacity: 0.7 }}>{label}</Box>
      <Box whiteSpace="nowrap">{value}</Box>
    </Stack>
  </Tooltip>
);

const InfoExtended: FC<{ name: string }> = ({ name }) => {
  const [info, setInfo] = useState<IPackageData | null>(null);
  const [bundlephobiaInfo, setBundlephobiaInfo] = useState<BundleData | null>(
    null
  );
  const [pkg, bndl] = useStore((state) => [
    state.packages[name],
    state.bundles[name],
  ]);

  useEffect(() => {
    (async () => {
      setInfo(await pkg);
    })();

    (async () => {
      setBundlephobiaInfo(await bndl);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [name, pkg, bndl]);

  return info ? (
    <Box>
      <Typography sx={{ opacity: 0.7 }}>{info.description}</Typography>

      <Divider sx={{ my: 2 }} />

      <Stack
        direction="row"
        alignItems="flex-start"
        justifyContent="space-between"
        gap={3.5}
      >
        <Stack direction="row" alignItems="center" gap={3.5}>
          <DetailBlock label="Updated" value={info.lastPublish} />
          <DetailBlock label="License" value={info.license} />
        </Stack>

        <Stack
          direction="row"
          alignItems="center"
          justifyContent="flex-end"
          gap={3.5}
          flexWrap="wrap"
          sx={{ "& div": { alignItems: "flex-end" } }}
        >
          {bundlephobiaInfo && (
            <>
              <DetailBlock
                label="Gzipped"
                value={prettyBytes(bundlephobiaInfo.gzip)}
              />
              <DetailBlock
                label="Minified"
                value={prettyBytes(bundlephobiaInfo.size)}
              />
            </>
          )}

          {info.size && (
            <DetailBlock
              label="Unpacked"
              value={prettyBytes(info.size)}
              title="Unpacked Size"
            />
          )}

          {bundlephobiaInfo && (
            <DetailBlock
              label="Dependencies"
              value={
                bundlephobiaInfo.dependencyCount ? (
                  bundlephobiaInfo.dependencyCount
                ) : (
                  <b style={{ color: "var(--vscode-charts-green)" }}>FREE</b>
                )
              }
            />
          )}
        </Stack>
      </Stack>

      <Divider sx={{ my: 2 }} />

      <Stack direction="row" alignItems="center" flexWrap="wrap" gap={2}>
        <Button
          href={info.repositoryUrl}
          target="_blank"
          rel="noreferrer"
          title="Open GitHub repository"
          startIcon={<GitHubIcon />}
          size="small"
          variant="outlined"
        >
          GitHub
        </Button>

        <Button
          href={info.npmUrl}
          target="_blank"
          rel="noreferrer"
          title="Open NPM page"
          startIcon={
            <SvgIcon>
              <NpmIcon />
            </SvgIcon>
          }
          size="small"
        >
          NPM
        </Button>

        {bundlephobiaInfo && (
          <Button
            href={bundlephobiaInfo.url}
            target="_blank"
            rel="noreferrer"
            title="Open Bundlephobia graphic"
            startIcon={
              <SvgIcon>
                <BundlephobiaIcon />
              </SvgIcon>
            }
            size="small"
          >
            BundlePhobia
          </Button>
        )}
      </Stack>
    </Box>
  ) : (
    <div>Loading...</div>
  );
};

export default InfoExtended;
