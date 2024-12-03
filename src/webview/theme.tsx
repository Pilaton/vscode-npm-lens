import { createTheme } from '@mui/material';

// Const getVSCodeStyle = (property: string): string =>
//   getComputedStyle(document.documentElement)
//     .getPropertyValue(property)
//     .trim() || "transparent";

const theme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: 'var(--vscode-editorWidget-background)',
      paper: 'var(--vscode-sideBar-background)',
    },

    divider: 'var(--vscode-sideBar-border, transparent)',
  },

  typography: {
    fontFamily: 'var(--vscode-font-family)',
  },

  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          outline: 'none !important',
          color: 'var(--vscode-textLink-foreground)',
          '&:hover': {
            color: 'var(--vscode-textLink-activeForeground)',
          },
          disabled: 'var(--vscode-activityBar-inactiveForeground)',
        },

        outlined: {
          borderColor: 'var(--vscode-textLink-foreground)',
          '&:hover': {
            borderColor: 'var(--vscode-textLink-activeForeground)',
          },
        },

        sizeSmall: {
          padding: '3px 9px',
        },
      },
    },
    MuiTypography: {
      styleOverrides: {
        root: {
          color: 'var(--vscode-editor-foreground)',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          color: 'var(--vscode-editor-foreground)',
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        indicator: {
          backgroundColor: 'var(--vscode-activityBarBadge-background)',
        },
      },
    },

    MuiAccordionSummary: {
      styleOverrides: {
        expandIconWrapper: { color: 'var(--vscode-icon-foreground)' },
      },
    },
  },
});

export default theme;
