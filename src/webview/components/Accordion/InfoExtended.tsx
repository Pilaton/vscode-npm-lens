import GitHubIcon from "@mui/icons-material/GitHub";
import {
  Box,
  Button,
  // CircularProgress, // TODO: size-provider is off
  Divider,
  Stack,
  SvgIcon,
  Tooltip,
  Typography,
} from "@mui/material";
import { ComponentProps, FC, useEffect, useState } from "react";

import { IPackageData } from "../../../providers/npm-provider";
// import { IBundleSizesData } from "../../../types/bundleSizes"; // TODO: size-provider is off
// import { ReactComponent as BundlephobiaIcon } from "../../assets/bundlephobia.svg"; // TODO: size-provider is off
import { ReactComponent as NpmIcon } from "../../assets/npm.svg";
import useStore from "../../store/store";
import convertSize from "../../utils/convertSize";

/* -------------------------------------------------------------------------- */

interface IDetailBlock extends ComponentProps<typeof Stack> {
  label: string;
  value: string | number | JSX.Element;
  title?: string;
}

interface IStateNPMInfo {
  data: IPackageData | null;
  isPending: boolean;
}

// interface IStateSizeInfo {
//   data: IBundleSizesData | null;
//   isPending: boolean;
// } // TODO: size-provider is off

// type GetValue = (
//   state: IStateSizeInfo,
//   key: keyof IBundleSizesData,
// ) => string | number | JSX.Element; // TODO: size-provider is off

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

/* -------------------------------------------------------------------------- */

// const getValue: GetValue = (state, key) => {
//   let val;

//   if (key === "size" || key === "gzip") {
//     val = convertSize(state.data?.[key]);
//   } else {
//     val = state.data?.[key];
//   }

//   return state.isPending ? <CircularProgress size={12} /> : val || "-";
// }; // TODO: size-provider is off

/* -------------------------------------------------------------------------- */

const InfoExtended: FC<{ name: string }> = ({ name }) => {
  const [npmInfo, setNpmInfo] = useState<IStateNPMInfo>({
    data: null,
    isPending: true,
  });
  // const [sizeInfo, setSizeInfo] = useState<IStateSizeInfo>({
  //   data: null,
  //   isPending: true,
  // }); // TODO: size-provider is off
  // const [pkg, bndl] = useStore((state) => [
  //   state.packages[name],
  //   state.bundles[name],
  // ]); // TODO: size-provider is off
  const [pkg] = useStore((state) => [state.packages[name]]);

  // useEffect(() => {
  //   (async () => {
  //     setNpmInfo({ data: await pkg, isPending: false });
  //   })();

  //   (async () => {
  //     setSizeInfo({ data: await bndl, isPending: false });
  //   })();
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [name, pkg, bndl]); // TODO: size-provider is off
  useEffect(() => {
    (async () => {
      setNpmInfo({ data: await pkg, isPending: false });
    })();
  }, [name, pkg]);

  return npmInfo.data ? (
    <Box>
      <Typography sx={{ opacity: 0.7 }}>{npmInfo.data.description}</Typography>

      <Divider sx={{ my: 2 }} />

      <Stack
        direction="row"
        alignItems="flex-start"
        justifyContent="space-between"
        gap={3.5}
      >
        <Stack direction="row" alignItems="center" gap={3.5}>
          <DetailBlock label="Updated" value={npmInfo.data.lastPublish} />
          <DetailBlock label="License" value={npmInfo.data.license} />
        </Stack>

        <Stack
          direction="row"
          alignItems="center"
          justifyContent="flex-end"
          gap={3.5}
          flexWrap="wrap"
          sx={{ "& div": { alignItems: "flex-end" } }}
        >
          {/* <DetailBlock label="Gzipped" value={getValue(sizeInfo, "gzip")} /> // TODO: size-provider is off */}
          {/* <DetailBlock label="Minified" value={getValue(sizeInfo, "size")} /> // TODO: size-provider is off */}

          <DetailBlock
            label="Unpacked"
            value={convertSize(npmInfo.data.size)}
            title="Unpacked Size"
          />

          {/* {sizeInfo.data?.dependencyCount !== undefined && (
            <DetailBlock
              label="Dependencies"
              value={
                sizeInfo.data.dependencyCount === 0 ? (
                  <b style={{ color: "var(--vscode-charts-green)" }}>FREE</b>
                ) : (
                  sizeInfo.data.dependencyCount
                )
              }
            />
          )} // TODO: size-provider is off */}
        </Stack>
      </Stack>

      <Divider sx={{ my: 2 }} />

      <Stack direction="row" alignItems="center" flexWrap="wrap" gap={2}>
        <Button
          href={npmInfo.data.repositoryUrl}
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
          href={npmInfo.data.npmUrl}
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

        {/* {sizeInfo.data?.url && (
          <Button
            href={sizeInfo.data.url}
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
        )} // TODO: size-provider is off */}
      </Stack>
    </Box>
  ) : (
    <div>Loading...</div>
  );
};

export default InfoExtended;
