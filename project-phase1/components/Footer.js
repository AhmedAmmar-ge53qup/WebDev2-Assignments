import React from "react";
import { Container, Stack, Typography } from "@mui/material";


export default function Footer() {
  
  return (
    <Container
      component="footer"
      sx={{ padding: "5px", width: "100%"}}
    >
      <Stack direction="row" justifyContent="space-between" sx={{ width: "100%", height: "100%" }} >
        <Typography variant="h10"  >© for CMPS 356</Typography>
        <Typography variant="h10"  >Made By Abdulaziz AlHams, Ahmed Ammar & Mohamed AlYazidi</Typography>
      </Stack>
    </Container>
  );
}
