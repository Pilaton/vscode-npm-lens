import { Tabs, Tab, Box } from "@mui/material";
import { FC, ReactNode, useState } from "react";

import { PackageJson } from "../../types/global";
import AccordionsDependency from "../Accordion";

import CounterDependency from "./CounterDependency";

interface TabPanelProps {
  children?: ReactNode;
  index: number;
  activeTab: number;
}

/* -------------------------------------------------------------------------- */

const TabPanel: FC<TabPanelProps> = ({ children, index, activeTab }) => {
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
};

/* -------------------------------------------------------------------------- */

const TabsDependency: FC = () => {
  const [activeTab, setActiveTab] = useState(0);

  const tabsData = [
    "dependencies",
    "devDependencies",
    "peerDependencies",
    "peerDependenciesMeta",
    "bundleDependencies",
    "optionalDependencies",
  ].filter((label): unknown => window.packageData[label as keyof PackageJson]);

  const handleTabChange = (_: React.SyntheticEvent, newTab: number): void =>
    setActiveTab(newTab);

  return (
    <>
      <Box
        sx={{
          borderBottom: 1,
          borderColor: "divider",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "1rem",
        }}
      >
        <Tabs
          value={activeTab}
          aria-label="npmLens tabs dependencies"
          onChange={handleTabChange}
          textColor="inherit"
          sx={{ mb: "-1px" }}
          variant="scrollable"
          scrollButtons={false}
        >
          {tabsData.map(
            (label): JSX.Element => (
              <Tab
                key={label}
                label={label}
                sx={{ textTransform: "inherit" }}
              />
            )
          )}
        </Tabs>
        <CounterDependency />
      </Box>
      {tabsData.map(
        (label, index): JSX.Element => (
          <TabPanel key={label} activeTab={activeTab} index={index}>
            <AccordionsDependency
              deps={window.packageData[label as keyof PackageJson] || {}}
            />
          </TabPanel>
        )
      )}
    </>
  );
};
export default TabsDependency;
