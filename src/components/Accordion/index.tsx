import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Accordion, AccordionSummary, AccordionDetails } from "@mui/material";
import { FC, useEffect, useMemo, useState } from "react";

import NPM from "../../providers/npm-provider";
import BundlePHProvider from "../../providers/size-providers/bundlephobia";
import useStore from "../../store/store";
import { Dependencies } from "../../types/global";

import InfoExtended from "./InfoExtended";
import InfoShort from "./InfoShort";
import VersionStatus from "./VersionStatus";

const AccordionsDependency: FC<{ deps: Dependencies }> = ({ deps }) => {
  const [expandedItem, setExpandedItem] = useState<string | false>(false);
  const { setPackages, setBundles } = useStore.getState();

  const npmProvider = useMemo(() => new NPM(deps), [deps]);
  const sizeProviders = useMemo(() => new BundlePHProvider(deps), [deps]); // BundlePHProvider or BundleJSProvider

  useEffect(() => {
    setPackages(npmProvider.getDataAllPackages());
    setBundles(sizeProviders.getDataAllBundles());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deps]);

  const handleAccordionChange =
    (panel: string) =>
    (_: React.ChangeEvent<unknown>, isExpanded: boolean): void => {
      setExpandedItem(isExpanded ? panel : false);
    };

  return (
    <>
      {Object.entries(deps).map(
        ([name, version]): JSX.Element => (
          <Accordion
            key={name}
            expanded={expandedItem === name}
            onChange={handleAccordionChange(name)}
            TransitionProps={{ mountOnEnter: true }}
            elevation={0}
          >
            <AccordionSummary
              aria-controls={name}
              id={name}
              expandIcon={<ExpandMoreIcon />}
              sx={{
                "& .MuiAccordionSummary-content": {
                  alignItems: "center",
                },
              }}
            >
              <InfoShort name={name} curVersion={version}>
                <VersionStatus props={{ name, npmProvider }} />
              </InfoShort>
            </AccordionSummary>

            <AccordionDetails sx={{ minHeight: "160px" }}>
              <InfoExtended name={name} />
            </AccordionDetails>
          </Accordion>
        )
      )}
    </>
  );
};
export default AccordionsDependency;
