import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import { useEffect, useMemo, useState } from 'react';
import type { Dependencies } from 'src/extension/utils/get-package-json';
import NpmPackageService from '../../services/npm-provider';
import useStore from '../../store/store';
import DeprecatedStatus from './deprecated-status';
import InfoExtended from './info-extended';
import InfoShort from './info-short';
import VersionStatus from './version-status';

interface Properties {
  dependencies: Dependencies;
}

export default function AccordionsDependency({ dependencies }: Properties) {
  const [expanded, setExpanded] = useState<string | false>(false);
  const { setPackages } = useStore.getState();

  const npmProvider = useMemo(() => new NpmPackageService(dependencies), [dependencies]);

  useEffect(() => {
    setPackages(npmProvider.getAllPackagesData());
  }, [npmProvider, setPackages]);

  return (
    <>
      {Object.entries(dependencies).map(([name, currentVersion]) => (
        <Accordion
          key={name}
          expanded={expanded === name}
          onChange={(_, isExpanded) => {
            setExpanded(isExpanded ? name : false);
          }}
          elevation={0}
          slotProps={{
            transition: { mountOnEnter: true },
          }}
        >
          <AccordionSummary
            aria-controls={name}
            id={name}
            expandIcon={<ExpandMoreIcon />}
            sx={{
              '& .MuiAccordionSummary-content': {
                alignItems: 'center',
              },
            }}
          >
            <InfoShort name={name} currentVersion={currentVersion} expanded={expanded === name}>
              <DeprecatedStatus name={name} npmProvider={npmProvider} />
              <VersionStatus name={name} npmProvider={npmProvider} />
            </InfoShort>
          </AccordionSummary>

          <AccordionDetails sx={{ minHeight: '160px' }}>
            <InfoExtended name={name} />
          </AccordionDetails>
        </Accordion>
      ))}
    </>
  );
}
