import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import { type PropsWithChildren, type SyntheticEvent, useState } from 'react';
import type { PackageJson } from '../../../extension/utils/get-package-json';
import AccordionsDependency from '../accordion';
import CounterDependency from './counter-dependency';

interface TabPanelProperties {
  index: number;
  activeTab: number;
}

interface TabsProps {
  packageJson: PackageJson;
}

/* -------------------------------------------------------------------------- */

function TabPanel({ children, index, activeTab }: PropsWithChildren<TabPanelProperties>) {
  const isCurrentTab = index === activeTab;
  return (
    <div
      role="tabpanel"
      hidden={!isCurrentTab}
      id={`npmlens-tabpanel-${index}`}
      aria-labelledby={`npmlens-tab-${index}`}
    >
      {isCurrentTab && <Box sx={{ py: 2 }}>{children}</Box>}
    </div>
  );
}

/* -------------------------------------------------------------------------- */

const TAB_NAMES = ['dependencies', 'devDependencies', 'peerDependencies'];

export default function TabsDependency({ packageJson }: TabsProps) {
  const [activeTab, setActiveTab] = useState(0);

  const tabNamesFiltered = TAB_NAMES.filter((field) => field in packageJson);

  const handleTabChange = (_: SyntheticEvent, newTab: number): void => {
    setActiveTab(newTab);
  };

  return (
    <>
      <Stack
        direction="row"
        sx={{
          borderBottom: 1,
          borderColor: 'var(--vscode-sideBar-border)',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
        }}
      >
        <Tabs
          value={activeTab}
          aria-label="npmLens tabs dependencies"
          onChange={handleTabChange}
          textColor="inherit"
          sx={{ mb: '-1px' }}
          variant="scrollable"
          scrollButtons={false}
        >
          {tabNamesFiltered.map((tabName) => (
            <Tab
              key={tabName}
              label={
                <Stack
                  direction="row"
                  spacing={1}
                  divider={
                    <Divider
                      orientation="vertical"
                      variant="inset"
                      flexItem
                      sx={{ borderColor: 'inherit', opacity: 0.2 }}
                    />
                  }
                >
                  <div>{tabName}</div>
                  <div>{Object.keys(packageJson[tabName as keyof PackageJson] || {}).length}</div>
                </Stack>
              }
              sx={{ textTransform: 'inherit' }}
            />
          ))}
        </Tabs>

        <Stack direction="row" sx={{ alignItems: 'center', gap: '2rem' }}>
          <CounterDependency />
        </Stack>
      </Stack>

      {tabNamesFiltered.map((tabName, index) => {
        const dependencies = packageJson[tabName as keyof PackageJson];
        if (!dependencies) return null;
        return (
          <TabPanel key={tabName} activeTab={activeTab} index={index}>
            <AccordionsDependency dependencies={dependencies} />
          </TabPanel>
        );
      })}
    </>
  );
}
