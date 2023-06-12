import { createTheme } from "@mui/material";

// const getVSCodeStyle = (property: string): string =>
//   getComputedStyle(document.documentElement)
//     .getPropertyValue(property)
//     .trim() || "transparent";

const theme = createTheme({
  palette: {
    mode: "dark",
    background: {
      default: "var(--vscode-editorWidget-background)",
      paper: "var(--vscode-sideBar-background)",
    },

    divider: "var(--vscode-sideBar-border, transparent)",

    action: {
      active: "var(--vscode-icon-foreground)",
      disabled: "var(--vscode-activityBar-inactiveForeground)",
    },
  },

  typography: {
    fontFamily: "var(--vscode-font-family)",
  },

  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          outline: "none !important",
        },

        containedSizeSmall: {
          color: "var(--vscode-button-foreground) !important",
          backgroundColor: "var(--vscode-button-background, transparent)",
          "&:hover": {
            backgroundColor: "var(--vscode-button-hoverBackground)",
          },
        },
        sizeSmall: {
          color: "var(--vscode-textLink-foreground)",
          padding: "3px 9px",
          borderColor: "var(--vscode-textLink-foreground)",
          "&:hover": {
            borderColor: "var(--vscode-textLink-activeForeground)",
          },
        },
      },
    },
    MuiTypography: {
      styleOverrides: {
        root: {
          color: "var(--vscode-editor-foreground)",
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          color: "var(--vscode-editor-foreground)",
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        indicator: {
          backgroundColor: "var(--vscode-activityBarBadge-background)",
        },
      },
    },
  },
});

export default theme;
