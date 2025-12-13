import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';
import Logo from './assets/logo.svg?react';
import Footer from './components/footer';
import Layout from './components/layout';
import TabsDependency from './components/tabs';
import { useExtensionMessage } from './hooks/use-extension-message';

const BoxVersion = styled('div')({
  letterSpacing: '0.75px',
  color: 'var(--vscode-foreground)',
  backgroundColor: 'hsla(0,0%,50.2%,.17)',
  padding: '1px 4px',
});

const LoadingContainer = styled('div')({
  height: '100vh',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
});

export default function App() {
  const { packageJson, extensionVersion, packageManager, isLoading, error } = useExtensionMessage();

  if (isLoading) {
    return (
      <Layout>
        <LoadingContainer>
          <CircularProgress />
        </LoadingContainer>
      </Layout>
    );
  }

  if (error || !packageJson) {
    return (
      <Layout>
        <LoadingContainer>{error ?? 'No package.json found'}</LoadingContainer>
      </Layout>
    );
  }

  return (
    <Layout>
      <header style={{ marginBottom: '1rem' }}>
        <Stack direction="row" alignItems="center">
          <Logo
            style={{
              fill: 'var(--vscode-activityBarBadge-background)',
              width: '40px',
            }}
          />

          <h1 style={{ paddingInline: '16px' }}>
            npmLens {import.meta.env.MODE === 'development' && 'DEV'}
          </h1>

          {extensionVersion && <BoxVersion>v{extensionVersion}</BoxVersion>}
        </Stack>
      </header>

      <TabsDependency packageJson={packageJson} />
      <Box sx={{ textAlign: 'right', marginTop: '.25rem', opacity: 0.7 }}>
        Package manager: {packageManager}
      </Box>

      <Footer />
    </Layout>
  );
}
