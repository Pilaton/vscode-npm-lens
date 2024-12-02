import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import copy from 'copy-to-clipboard';
import { useEffect, useState } from 'react';

interface InfoShortProperties {
  name: string;
  currentVersion: string;
  expanded: boolean;
}

export default function InfoShort({
  name,
  currentVersion,
  expanded,
  children,
}: React.PropsWithChildren<InfoShortProperties>) {
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    if (isCopied) {
      const timer = setTimeout(() => {
        setIsCopied(false);
      }, 5000);
      return () => {
        clearTimeout(timer);
      };
    }
  }, [isCopied]);

  return (
    <>
      <Grid
        container
        spacing={1}
        sx={{ width: '40%', flexShrink: 0, alignItems: 'center', fontSize: '.9375rem' }}
      >
        <Grid item>{name}</Grid>

        {expanded && (
          <Grid
            item
            sx={{}}
            onClick={(event) => {
              event.stopPropagation();
            }}
          >
            <Button
              size="small"
              sx={{ minWidth: 0 }}
              onClick={() => {
                copy(name) && setIsCopied(true);
              }}
            >
              {isCopied ? (
                <CheckCircleIcon color="success" sx={{ fontSize: '1rem' }} />
              ) : (
                <ContentCopyIcon sx={{ fontSize: '1rem' }} />
              )}
            </Button>
          </Grid>
        )}
      </Grid>

      <Box sx={{ width: '20%', textAlign: 'right', letterSpacing: '0.75px' }}>{currentVersion}</Box>

      {children}

      <Box sx={{ width: '10%' }} />
    </>
  );
}
