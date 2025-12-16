import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { useEffect, useMemo, useState } from 'react';
import type { Dependencies } from 'src/extension/utils/get-package-json';
import NpmPackageService from '../../services/npm-provider';
import useStore from '../../store/store';
import InfoExtended from './info-extended';
import { CurrentWithInRange } from './info-short/current-with-in-range';
import DeprecatedStatus from './info-short/deprecated-status';
import { PkgName } from './info-short/pkg-name';
import { VersionCell } from './info-short/version-status';

/* -------------------------------------------------------------------------- */
/*                              Column Layout                                 */
/* -------------------------------------------------------------------------- */

/** Shared column widths for header and body alignment */
const COLUMN_WIDTHS = {
  package: '35%',
  current: '20%',
  latest: '20%',
  spacer: '20%',
} as const;

const headerStyles = {
  fontSize: '0.75rem',
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
  color: 'var(--vscode-descriptionForeground)',
  opacity: 0.8,
} as const;

/* -------------------------------------------------------------------------- */
/*                              Component                                     */
/* -------------------------------------------------------------------------- */

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
      <Stack
        direction="row"
        sx={{
          alignItems: 'center',
          gap: '1rem',
          padding: '0.5rem 16px',
          paddingRight: 'calc(16px + 24px)',
          ...headerStyles,
        }}
      >
        <Box sx={{ width: COLUMN_WIDTHS.package, flexShrink: 0 }}>Package</Box>
        <Box sx={{ width: COLUMN_WIDTHS.current, textAlign: 'right' }}>Current</Box>
        <Box sx={{ width: COLUMN_WIDTHS.latest, textAlign: 'right' }}>Latest</Box>
        <Box sx={{ width: COLUMN_WIDTHS.spacer }} />
      </Stack>

      {Object.entries(dependencies).map(([name, currentVersion]) => (
        <Accordion
          key={name}
          expanded={expanded === name}
          onChange={(_, isExpanded) => {
            setExpanded(isExpanded ? name : false);
          }}
          elevation={0}
          slotProps={{
            heading: { component: 'div' },
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
                gap: '1rem',
              },
            }}
          >
            <Stack
              component="span"
              direction="row"
              spacing={1}
              sx={{
                width: COLUMN_WIDTHS.package,
                alignItems: 'center',
                flexShrink: 0,
                fontSize: '.9375rem',
              }}
            >
              <DeprecatedStatus name={name} npmProvider={npmProvider} />
              <PkgName name={name} expanded={expanded === name} />
            </Stack>

            <Stack
              component="span"
              direction="row"
              gap={0.5}
              sx={{
                width: COLUMN_WIDTHS.current,
                letterSpacing: '0.75px',
                justifyContent: 'end',
                alignItems: 'center',
              }}
            >
              <CurrentWithInRange
                name={name}
                currentVersion={currentVersion}
                currentVersionSpec={currentVersion}
                npmProvider={npmProvider}
              />
            </Stack>

            <Box
              component="span"
              sx={{
                width: COLUMN_WIDTHS.latest,
                letterSpacing: '0.75px',
                textAlign: 'right',
              }}
            >
              <VersionCell
                name={name}
                npmProvider={npmProvider}
                type="latest"
                currentVersionSpec={currentVersion}
              />
            </Box>

            <Box component="span" sx={{ width: COLUMN_WIDTHS.spacer }} />
          </AccordionSummary>

          <AccordionDetails sx={{ minHeight: '160px' }}>
            <InfoExtended name={name} />
          </AccordionDetails>
        </Accordion>
      ))}
    </>
  );
}
