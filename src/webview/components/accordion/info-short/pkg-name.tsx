import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import Box from '@mui/material/Box';
import { useEffect, useState } from 'react';
import { useVscode } from '../../../hooks/use-vscode';

interface Props {
  name: string;
  expanded: boolean;
}

export function PkgName({ name, expanded }: Props) {
  const { copyToClipboard } = useVscode();
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

  const handleCopy = () => {
    copyToClipboard(name);
    setIsCopied(true);
  };

  return (
    <>
      <Box component="span">{name}</Box>

      {expanded && (
        <Box
          component="span"
          role="button"
          tabIndex={0}
          onClick={(event) => {
            event.stopPropagation();
            handleCopy();
          }}
          onKeyDown={(event) => {
            if (event.key === 'Enter' || event.key === ' ') {
              event.preventDefault();
              event.stopPropagation();
              handleCopy();
            }
          }}
          sx={{
            cursor: 'pointer',
            display: 'inline-flex',
            padding: '4px',
            borderRadius: '4px',
            '&:hover': {
              backgroundColor: 'var(--vscode-toolbar-hoverBackground)',
            },
          }}
        >
          {isCopied ? (
            <CheckCircleIcon color="success" sx={{ fontSize: '1rem' }} />
          ) : (
            <ContentCopyIcon sx={{ fontSize: '1rem' }} />
          )}
        </Box>
      )}
    </>
  );
}
