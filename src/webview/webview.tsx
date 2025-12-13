import { ThemeProvider } from '@mui/material/styles';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './app';
import theme from './theme';

const rootElement = document.querySelector('#root');
if (!rootElement) {
  throw new Error("No element with id 'root' found in the document.");
}

const root = createRoot(rootElement);

root.render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <App />
    </ThemeProvider>
  </StrictMode>
);
