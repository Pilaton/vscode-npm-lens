import { Tabs, Tab, Box, Button } from "@mui/material";
import { useState } from "react";
import { type MessageListener } from "src/controllers/web-view-panel";
import { type IPackageJson } from "src/utils/get-package-json";

import AccordionsDependency from "../Accordion";

import CounterDependency from "./counter-dependency";

interface TabPanelProperties {
  index: number;
  activeTab: number;
}

/* -------------------------------------------------------------------------- */

function TabPanel({
  children,
  index,
  activeTab,
}: React.PropsWithChildren<TabPanelProperties>) {
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

const handleUpdateAllPackages = () => {
  const { vscode } = window;
  vscode.postMessage({
    command: "updateAllPackages",
  } satisfies MessageListener);
};

export default function TabsDependency({
  packageJson,
}: {
  packageJson: IPackageJson;
}) {
  const [activeTab, setActiveTab] = useState(0);

  const tabsData = [
    "dependencies",
    "devDependencies",
    "peerDependencies",
  ].filter((field) => field in packageJson);

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
          {tabsData.map((field) => (
            <Tab key={field} label={field} sx={{ textTransform: "inherit" }} />
          ))}
        </Tabs>
        <Box sx={{ display: "flex", alignItems: "center", gap: "2rem" }}>
          <CounterDependency />
          <Button
            size="small"
            variant="outlined"
            onClick={handleUpdateAllPackages}
          >
            Update all
          </Button>
        </Box>
      </Box>
      {tabsData.map((field, index) => {
        const dependencies = packageJson[field as keyof IPackageJson]!;

        return (
          <TabPanel key={field} activeTab={activeTab} index={index}>
            <AccordionsDependency dependencies={dependencies} />
          </TabPanel>
        );
      })}
    </>
  );
}
