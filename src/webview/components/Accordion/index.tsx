import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Accordion, AccordionSummary, AccordionDetails } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { type Dependencies } from "src/utils/get-package-json";

import NPM from "../../../providers/npm-provider";
import useStore from "../../store/store";

import InfoExtended from "./info-extended";
import InfoShort from "./info-short";
import VersionStatus from "./version-status";

interface IProperties {
  dependencies: Dependencies;
}

export default function AccordionsDependency({ dependencies }: IProperties) {
  const [expanded, setExpanded] = useState<string | false>(false);
  const { setPackages } = useStore.getState();

  const npmProvider = useMemo(() => new NPM(dependencies), [dependencies]);

  useEffect(() => {
    setPackages(npmProvider.getDataAllPackages());
  }, [dependencies, npmProvider, setPackages]);

  return (
    <>
      {Object.entries(dependencies).map(([name, currentVersion]) => (
        <Accordion
          key={name}
          expanded={expanded === name}
          onChange={(_, isExpanded) => {
            setExpanded(isExpanded ? name : false);
          }}
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
            <InfoShort name={name} currentVersion={currentVersion}>
              <VersionStatus name={name} npmProvider={npmProvider} />
            </InfoShort>
          </AccordionSummary>

          <AccordionDetails sx={{ minHeight: "160px" }}>
            <InfoExtended name={name} />
          </AccordionDetails>
        </Accordion>
      ))}
    </>
  );
}
