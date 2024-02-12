import { CircularProgress, Stack } from "@mui/material";
import prettyBytes from "pretty-bytes";
import { useEffect, useState } from "react";
import useStore from "../../store/store";
import { DetailBlock } from "../Accordion/info-extended";

/* -------------------------------------------------------------------------- */

export default function CounterDependency() {
  const [count, setCount] = useState<number>(0);

  const packages = useStore((state) => state.packages);

  useEffect(() => {
    let isMounted = true;

    const fetchPackages = async () => {
      const readyPackages = await Promise.all(Object.values(packages));
      const totalCount = readyPackages.reduce(
        (accumulator, data) => accumulator + (data?.size ?? 0),
        0
      );

      if (isMounted) {
        setCount(totalCount);
      }
    };
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    fetchPackages();

    return () => {
      isMounted = false;
    };
  }, [packages]);

  return (
    <Stack
      direction="row"
      spacing={3.5}
      sx={{ "& div": { alignItems: "flex-end" } }}
    >
      <DetailBlock
        label="Unpacked"
        value={count ? prettyBytes(count) : <CircularProgress size={12} />}
      />
    </Stack>
  );
}
