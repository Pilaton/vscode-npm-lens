import WarningIcon from '@mui/icons-material/Warning';
import Chip from '@mui/material/Chip';
import Tooltip from '@mui/material/Tooltip';

interface DeprecatedBadgeProps {
  message?: string;
}

export default function DeprecatedBadge({ message }: DeprecatedBadgeProps) {
  if (!message) {
    return null;
  }

  const handleClick = (event: React.MouseEvent) => {
    event.stopPropagation();
  };

  return (
    <Tooltip
      title={message}
      arrow
      slotProps={{
        popper: {
          onClick: handleClick,
        },
        tooltip: {
          sx: {
            backgroundColor: 'var(--vscode-editorWidget-background)',
            color: 'var(--vscode-editorWidget-foreground)',
            border: '1px solid var(--vscode-editorWidget-border)',
            fontSize: '0.75rem',
            maxWidth: 350,
            padding: '8px 12px',
            lineHeight: 1.5,
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
          },
        },
        arrow: {
          sx: {
            color: 'var(--vscode-editorWidget-background)',
            '&::before': {
              border: '1px solid var(--vscode-editorWidget-border)',
            },
          },
        },
      }}
    >
      <Chip
        icon={<WarningIcon sx={{ fontSize: '0.875rem' }} />}
        label="DEPRECATED"
        size="small"
        onClick={handleClick}
        sx={{
          height: '20px',
          fontSize: '0.625rem',
          fontWeight: 600,
          letterSpacing: '0.5px',
          cursor: 'help',
          backgroundColor: 'var(--vscode-editorWarning-background)',
          color: 'var(--vscode-editorWarning-foreground)',
          border: '1px solid var(--vscode-editorWarning-foreground)',
          '& .MuiChip-icon': {
            color: 'var(--vscode-editorWarning-foreground)',
          },
        }}
      />
    </Tooltip>
  );
}
