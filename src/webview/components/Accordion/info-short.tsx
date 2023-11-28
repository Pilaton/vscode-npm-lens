import { Box } from "@mui/material";

interface InfoShortProperties {
  name: string;
  currentVersion: string;
}

function InfoShort({
  name,
  currentVersion,
  children,
}: React.PropsWithChildren<InfoShortProperties>) {
  return (
    <>
      <Box sx={{ width: "40%", flexShrink: 0, fontSize: ".9375rem" }}>
        {name}
      </Box>

      <Box sx={{ width: "20%", textAlign: "right", letterSpacing: "0.75px" }}>
        {currentVersion}
      </Box>

      <Box sx={{ width: "20%", textAlign: "right" }}>{children}</Box>

      <Box sx={{ width: "20%" }} />
    </>
  );
}
export default InfoShort;
