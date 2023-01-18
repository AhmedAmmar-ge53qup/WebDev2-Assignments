import { Container, Grid, Paper } from "@mui/material";
import React from "react";

export default function Form({ children }) {
  return (
    <Container>
      <Grid
        container
        direction="column"
        alignItems="center"
        justify="center"
        justifyContent={"center"}
      >
        <Grid minWidth={600}>
          <Paper elevation={15} sx={{ padding: 5, minHeight: 200 }}>
            <Grid container>
              <Grid
                container
                minHeight={200}
                rowGap={3}
                justifyContent={"center"}
                flexDirection="column"
                alignItems={"stretch"}
              >
                {children}
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}
