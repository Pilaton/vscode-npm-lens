import { Box } from "@mui/material";

function Layout({ children }: React.PropsWithChildren): React.ReactElement {
  return (
    <Box sx={{ maxWidth: "1000px", margin: "0 auto", padding: "20px" }}>
      {children}
    </Box>
  );
}
export default Layout;
