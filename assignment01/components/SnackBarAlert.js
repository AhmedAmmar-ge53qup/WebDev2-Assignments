import { Alert, Snackbar } from "@mui/material";
import React from "react";
import { FETCH_ACTIONS } from "../types/FetchActions";

export default function SnackBarAlert({ fetchStatedispatcher, severity }) {
  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    // Resetting fetch action state, to disable snackbars
    fetchStatedispatcher({ type: FETCH_ACTIONS.RESET });
  };

  const createSnackBar = (text) => {
    return (
      <Snackbar open={true} autoHideDuration={3000} onClose={handleClose}>
        <Alert onClose={handleClose} severity={severity} sx={{ width: "100%" }}>
          {text}
        </Alert>
      </Snackbar>
    );
  };

  switch (severity) {
    case "success":
      return createSnackBar("Success");
    case "error":
      return createSnackBar("Error");
    case "info":
      return createSnackBar("Fetching ...");
    default:
      return <></>;
  }
}
