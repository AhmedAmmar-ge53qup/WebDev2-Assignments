import { Card, CardContent, Grid, Paper, Typography } from "@mui/material";
import React from "react";

export default function Pair(props) {
  return (
    <Grid>
      <Card sx={{ minWidth: 180 }}>
        <CardContent>
          <Typography>{props.name}</Typography>
          <Typography>{props.conversionRate}</Typography>
        </CardContent>
      </Card>
    </Grid>
  );
}
