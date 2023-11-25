import { Typography, Box } from "@mui/material";
import { ReactNode } from "react";

interface InfoShortProperties {
  name: string;
  curVersion: string;
  children: ReactNode;
}

function InfoShort({ name, curVersion, children }: InfoShortProperties) {
  return (
    <>
      <Typography sx={{ width: "40%", flexShrink: 0, fontSize: ".9375rem" }}>
        {name}
      </Typography>

      <Box sx={{ width: "20%", textAlign: "right", letterSpacing: "0.75px" }}>
        {curVersion}
      </Box>

      <Box sx={{ width: "20%", textAlign: "right" }}>{children}</Box>

      <Box sx={{ width: "20%" }} />
    </>
  );
}
export default InfoShort;
