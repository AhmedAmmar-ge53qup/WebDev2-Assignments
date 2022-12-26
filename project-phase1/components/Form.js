import { Container, Grid, Paper } from "@mui/material";
import React from "react";

export default function Form({ children, login }) {
  return (
    <Container>
      <Grid
        container
        spacing={0}
        direction="column"
        alignItems="center"
        justify="center"
        style={{ minHeight: "100vh" }}
        justifyContent={"center"}
      >
        <Grid minWidth={600}>
          <Paper elevation={15} sx={{ padding: 5, minHeight: 400 }}>
            <Grid container>
              <Grid
                container
                minHeight={400}
                rowGap={3}
                justifyContent={"center"}
                flexDirection="column"
                alignItems={"center"}
              >
                {children}
              </Grid>
              {login || <></>}
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}
