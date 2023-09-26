import { CircularProgress, Stack } from "@mui/material";
import prettyBytes from "pretty-bytes";
import { useEffect, useState } from "react";

import useStore from "../../store/store";
import { DetailBlock } from "../Accordion/InfoExtended";

/* -------------------------------------------------------------------------- */

interface CountState {
  // gzip: number; // TODO: size-provider is off
  // minified: number; // TODO: size-provider is off
  unpacked: number;
}

interface FetchPackages {
  unpacked: 0;
}

// interface FetchBundles {
//   gzip: number;
//   minified: number;
// } // TODO: size-provider is off

/* -------------------------------------------------------------------------- */

const CounterDependency = () => {
  const [counts, setCounts] = useState<CountState>({
    // gzip: 0, // TODO: size-provider is off
    // minified: 0, // TODO: size-provider is off
    unpacked: 0,
  });

  // const { packages, bundles } = useStore((state) => ({
  //   packages: state.packages,
  //   bundles: state.bundles,
  // })); // TODO: size-provider is off
  const { packages } = useStore((state) => ({
    packages: state.packages,
  }));

  useEffect(() => {
    const fetchPackages = async (): Promise<FetchPackages> => {
      const readyPackages = await Promise.all(Object.values(packages));

      return readyPackages.reduce(
        (acc, data) => {
          acc.unpacked += data?.size || 0;
          return acc;
        },
        { unpacked: 0 },
      );
    };

    // const fetchBundles = async (): Promise<FetchBundles> => {
    //   const readyBundles = await Promise.all(Object.values(bundles));

    //   return readyBundles.reduce(
    //     (acc, data) => {
    //       acc.gzip += data?.gzip || 0;
    //       acc.minified += data?.size || 0;
    //       return acc;
    //     },
    //     { gzip: 0, minified: 0 },
    //   );
    // };
    // TODO: size-provider is off

    //   (async () => {
    //     const [packageCounts, bundleCounts] = await Promise.all([
    //       fetchPackages(),
    //       fetchBundles(),
    //     ]);

    //     setCounts({
    //       gzip: bundleCounts.gzip,
    //       minified: bundleCounts.minified,
    //       unpacked: packageCounts.unpacked,
    //     });
    //   })();
    // }, [bundles, packages]); // TODO: size-provider is off
    (async () => {
      const [packageCounts] = await Promise.all([fetchPackages()]);

      setCounts({
        unpacked: packageCounts.unpacked,
      });
    })();
  }, [packages]);

  const details = [
    // { label: "Gzipped", value: counts.gzip }, // TODO: size-provider is off
    // { label: "Minified", value: counts.minified }, // TODO: size-provider is off
    { label: "Unpacked", value: counts.unpacked },
  ];

  return (
    <Stack
      direction="row"
      spacing={3.5}
      sx={{ "& div": { alignItems: "flex-end" } }}
    >
      {details.map(({ label, value }) => (
        <DetailBlock
          key={label}
          label={label}
          value={value ? prettyBytes(value) : <CircularProgress size={12} />}
        />
      ))}
    </Stack>
  );
};
export default CounterDependency;
