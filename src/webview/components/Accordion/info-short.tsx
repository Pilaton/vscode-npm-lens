import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
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
    <Stack direction="row" spacing={2} sx={{ width: '100%', alignItems: 'center' }}>
      <Stack
        direction="row"
        spacing={1}
        sx={{ width: '40%', alignItems: 'center', flexShrink: 0, fontSize: '.9375rem' }}
      >
        <Box>{name}</Box>

        {expanded && (
          <Button
            size="small"
            sx={{ minWidth: 0 }}
            onClick={(event) => {
              event.stopPropagation();
              copy(name) && setIsCopied(true);
            }}
          >
            {isCopied ? (
              <CheckCircleIcon color="success" sx={{ fontSize: '1rem' }} />
            ) : (
              <ContentCopyIcon sx={{ fontSize: '1rem' }} />
            )}
          </Button>
        )}
      </Stack>

      <Box sx={{ width: '20%', textAlign: 'right', letterSpacing: '0.75px' }}>{currentVersion}</Box>

      {children}

      <Box sx={{ width: '10%' }} />
    </Stack>
  );
}
