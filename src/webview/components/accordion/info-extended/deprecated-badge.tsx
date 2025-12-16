import WarningIcon from '@mui/icons-material/Warning';
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
      <WarningIcon
        sx={{
          fontSize: '1.25rem',
          color: 'var(--vscode-editorWarning-foreground)',
          cursor: 'help',
        }}
        onClick={handleClick}
      />
    </Tooltip>
  );
}
