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
import { useEffect, useState } from "react";
import { type IPackageData } from "../../../providers/npm-provider";
import NpmIcon from "../../assets/npm.svg?react";
import useStore from "../../store/store";
import convertSize from "../../utils/convert-size";

/* -------------------------------------------------------------------------- */

interface IDetailBlock extends React.ComponentProps<typeof Stack> {
  label: string;
  value: React.ReactNode;
  title?: string;
}

interface IStateNPMInfo {
  data: IPackageData | null;
  isPending: boolean;
}

/* -------------------------------------------------------------------------- */

export function DetailBlock({ label, value, title = "" }: IDetailBlock) {
  return (
    <Tooltip title={title} arrow placement="top" enterDelay={50}>
      <Stack spacing={0.5}>
        <Box sx={{ opacity: 0.7 }}>{label}</Box>
        <Box whiteSpace="nowrap">{value}</Box>
      </Stack>
    </Tooltip>
  );
}

export default function InfoExtended({ name }: { name: string }) {
  const [npmInfo, setNpmInfo] = useState<IStateNPMInfo>({
    data: null,
    isPending: true,
  });

  const packageData = useStore(async (state) => await state.packages[name]);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      const data = await packageData;
      if (isMounted) {
        setNpmInfo({ data, isPending: false });
      }
    };
    fetchData()
      .then((data) => data)
      .catch((error) => {
        console.log(error);
      });

    return () => {
      isMounted = false;
    };
  }, [name, packageData]);

  if (npmInfo.isPending || !npmInfo.data) {
    return <div>Loading...</div>;
  }

  return (
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
          <DetailBlock
            label="Unpacked"
            value={convertSize(npmInfo.data.size)}
            title="Unpacked Size"
          />
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
      </Stack>
    </Box>
  );
}
