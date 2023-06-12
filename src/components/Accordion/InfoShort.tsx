import { Typography, Box } from "@mui/material";
import { FC, ReactNode } from "react";

interface InfoShortProps {
  name: string;
  curVersion: string;
  children: ReactNode;
}

const InfoShort: FC<InfoShortProps> = ({ name, curVersion, children }) => (
  <>
    <Typography sx={{ width: "40%", flexShrink: 0 }}>{name}</Typography>

    <Box sx={{ width: "20%", textAlign: "right", letterSpacing: "0.75px" }}>
      {curVersion}
    </Box>

    <Box sx={{ width: "20%", textAlign: "right" }}>{children}</Box>

    <Box sx={{ width: "20%" }}></Box>
  </>
);
export default InfoShort;
