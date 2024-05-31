import {
  Autocomplete,
  Container,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  ThemeProvider,
} from "@mui/material";
import { Box } from "@mui/system";
import React, { useEffect, useReducer, useState } from "react";
import Pair from "../components/Pair";
import { BLUE_THEME } from "../components/BlueTheme";
import { FETCH_ACTIONS } from "../types/FetchActions";
import SnackBarAlert from "../components/SnackBarAlert";

export default function Dashboard() {
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const [baseCurrency, setBaseCurrency] = useState("USD");
  const [rates, setRates] = useState({});
  const [fetchState, fetchStatedispatcher] = useReducer(fetchStateReducer, {
    fetchSuccess: false,
    fetchLoading: false,
    fetchFailed: false,
  });

  // Reducer function to manage fetch states (success, load, failed)
  // The "RESET" state is used to reset everything to false (to hide all snackbars)
  function fetchStateReducer(state, { type, payload }) {
    switch (type) {
      case FETCH_ACTIONS.FETCH_SUCCESS:
        return { fetchSuccess: true, fetchLoading: false, fetchFailed: false };
      case FETCH_ACTIONS.FETCH_LOADING:
        return { fetchSuccess: false, fetchLoading: true, fetchFailed: false };
      case FETCH_ACTIONS.FETCH_FAILED:
        return { fetchSuccess: false, fetchLoading: false, fetchFailed: true };
      case FETCH_ACTIONS.RESET:
        return { fetchSuccess: false, fetchLoading: false, fetchFailed: false };
      default:
        break;
    }
  }

  // If baseCurrency exists in localStorage, set it to the state variable
  useEffect(() => {
    if (isFirstLoad && localStorage.baseCurrency) {
      setBaseCurrency(localStorage.baseCurrency);
      setIsFirstLoad(false);
    } else if (isFirstLoad && !localStorage.baseCurrency) {
      localStorage.baseCurrency = baseCurrency;
      setIsFirstLoad(false);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFirstLoad]);

  // Fetching done here, with every change of the state variable "baseCurrency"
  useEffect(() => {
    fetchStatedispatcher({ type: FETCH_ACTIONS.FETCH_LOADING }); // Setting fetch state to loading

    // Fetching data based on baseCurrency provided by user
    fetch(`https://api.frankfurter.app/latest?from=${baseCurrency}`)

      .then((res) =>
        res.json().then((data) => {
          setRates(data.rates);
          fetchStatedispatcher({ type: FETCH_ACTIONS.FETCH_SUCCESS }); // Setting fetch state to success
        })
      )
      .catch((error) => {
        fetchStatedispatcher({ type: FETCH_ACTIONS.FETCH_FAILED }); // Setting fetch state to failed
      });

    if (!isFirstLoad) localStorage.baseCurrency = baseCurrency;

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [baseCurrency]);

  // The JSX needed to be returned by the component, its stored in a variable for better organization
  const returnedJSX = (
    <>
      <Container>
        <Box sx={{ minWidth: 120 }}>
          <FormControl sx={{ m: 2, minWidth: 300 }}>
            <Autocomplete
              disablePortal
              id="combo-box-demo"
              value={baseCurrency}
              options={rates ? Object.keys(rates).map((currencyName) => currencyName) : []}
              sx={{ width: 300 }}
              renderInput={(params) => (
                <TextField {...params} label="Base Currency" />
              )}
              onChange={(e, newValue) =>
                newValue
                  ? setBaseCurrency(newValue)
                  : setBaseCurrency((prev) => prev)
              }
            />
          </FormControl>
        </Box>
        <Grid container gap={1.5}>
          {rates ? Object.keys(rates).map((currencyName) => (
            <Pair
              key={currencyName}
              name={`${baseCurrency}/${currencyName}`}
              conversionRate={rates[currencyName]}
            />
          )) : null}
        </Grid>
      </Container>
    </>
  );

  return (
    <>
      <ThemeProvider theme={BLUE_THEME}>
        <SnackBarAlert
          fetchStatedispatcher={fetchStatedispatcher}
          severity={
            fetchState.fetchSuccess
              ? "success"
              : fetchState.fetchLoading
              ? "info"
              : fetchState.fetchFailed
              ? "error"
              : ""
          }
        ></SnackBarAlert>
        {rates ? returnedJSX : <p>Loading...</p>}
      </ThemeProvider>
    </>
  );
}
