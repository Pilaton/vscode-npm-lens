import { Box } from '@mui/material';

export default function Layout({ children }: React.PropsWithChildren) {
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
