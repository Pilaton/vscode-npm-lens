import { Box, Stack } from "@mui/material";
import { ThemeProvider, styled } from "@mui/material/styles";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import Logo from "../assets/logo.svg";
import Layout from "../components/Layout";
import TabsDependency from "../components/Tabs";

import theme from "./theme";

const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error("No element with id 'root' found in the document.");
}

const versionExt = window.versionExtension;

const root = createRoot(rootElement);

const BoxVersion = styled(Box)({
  letterSpacing: "0.75px",
  color: "var(--vscode-foreground)",
  backgroundColor: "hsla(0,0%,50.2%,.17)",
  padding: "1px 4px",
});

root.render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <Layout>
        <header style={{ marginBottom: ".5rem" }}>
          <Stack direction="row" alignItems="center">
            <Logo
              style={{
                fill: "var(--vscode-activityBarBadge-background)",
                width: "40px",
              }}
            />

            <h1 style={{ paddingInline: "16px" }}>npmLens</h1>

            {versionExt && <BoxVersion>v{versionExt}</BoxVersion>}
          </Stack>
        </header>

        <TabsDependency />
      </Layout>
    </ThemeProvider>
  </StrictMode>
);
