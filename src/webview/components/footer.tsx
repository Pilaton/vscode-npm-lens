import GitHubIcon from '@mui/icons-material/GitHub';
import StarIcon from '@mui/icons-material/Star';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';

const FooterContainer = styled('footer')({
  marginTop: '2rem',
  paddingTop: '1rem',
  borderTop: '1px solid var(--vscode-widget-border)',
  opacity: 0.7,
  fontSize: '0.85rem',
  '&:hover': {
    opacity: 1,
  },
});

const FooterLink = styled(Link)({
  display: 'inline-flex',
  alignItems: 'center',
  gap: '4px',
  color: 'var(--vscode-textLink-foreground)',
  textDecoration: 'none',
  '&:hover': {
    textDecoration: 'underline',
  },
});

const GITHUB_URL = 'https://github.com/Pilaton/vscode-npm-lens';
const MARKETPLACE_URL =
  'https://marketplace.visualstudio.com/items?itemName=Pilaton.vscode-npm-lens&ssr=false#review-details';

export default function Footer() {
  return (
    <FooterContainer>
      <Stack direction="row" spacing={3} justifyContent="center" alignItems="center">
        <FooterLink href={GITHUB_URL} target="_blank" rel="noopener noreferrer">
          <GitHubIcon sx={{ fontSize: '1rem' }} />
          GitHub
        </FooterLink>

        <FooterLink
          href={GITHUB_URL}
          target="_blank"
          rel="noopener noreferrer"
          sx={{ color: 'var(--vscode-editorWarning-foreground)' }}
        >
          <StarIcon sx={{ fontSize: '1rem' }} />
          Star
        </FooterLink>

        <FooterLink href={MARKETPLACE_URL} target="_blank" rel="noopener noreferrer">
          <ThumbUpIcon sx={{ fontSize: '1rem' }} />
          Rate
        </FooterLink>
      </Stack>
    </FooterContainer>
  );
}
