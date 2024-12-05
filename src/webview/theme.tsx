import { createTheme } from '@mui/material';

// Const getVSCodeStyle = (property: string): string =>
//   getComputedStyle(document.documentElement)
//     .getPropertyValue(property)
//     .trim() || "transparent";

export default createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: 'var(--vscode-editorWidget-background)',
      paper: 'var(--vscode-sideBar-background)',
    },
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

    MuiTabs: {
      styleOverrides: {
        indicator: {
          backgroundColor: 'var(--vscode-activityBarBadge-background)',
        },
      },
    },

    MuiAccordion: {
      styleOverrides: {
        root: {
          '&:before': {
            backgroundColor: 'var(--vscode-sideBar-border)',
          },
        },
      },
    },
    MuiAccordionSummary: {
      styleOverrides: {
        expandIconWrapper: { color: 'var(--vscode-icon-foreground)' },
      },
    },

    MuiDivider: {
      styleOverrides: {
        root: { borderColor: 'var(--vscode-sideBar-border)' },
      },
    },
  },
});
