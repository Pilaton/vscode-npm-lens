import { Box } from "@mui/material";
import { FC, ReactNode } from "react";

interface LayoutProps {
  children: ReactNode;
}

const Layout: FC<LayoutProps> = ({ children }) => (
  <Box sx={{ maxWidth: "1000px", margin: "0 auto", padding: "20px" }}>
    {children}
  </Box>
);
export default Layout;
