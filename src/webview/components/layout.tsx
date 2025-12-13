import Box from '@mui/material/Box';
import type { PropsWithChildren } from 'react';

export default function Layout({ children }: PropsWithChildren) {
  return (
    <Box
      sx={{
        minWidth: '500px',
        maxWidth: '1000px',
        margin: '0 auto',
        padding: '20px',
      }}
    >
      {children}
    </Box>
  );
}
