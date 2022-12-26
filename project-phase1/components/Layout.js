import { Grid } from "@mui/material";
import { Container } from "@mui/system";
import React from "react";
import Footer from "./Footer";
import Header from "./Header";

export default function Layout({ children }) {
  return (
    
      <Container sx={{width: 1}}>
        <Header />
        <Grid container rowGap={35} sx={{ mt: 2, width:"100%"}}>
            {children}
          <Footer />
        </Grid>
      </Container>
  
  );
}
