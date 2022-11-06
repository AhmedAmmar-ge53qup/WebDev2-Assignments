import { BLUE_THEME } from "../components/BlueTheme";
import "../styles/globals.css";
import { ThemeProvider } from "@mui/material";

function MyApp({ Component, pageProps }) {
  return (
    <ThemeProvider theme={BLUE_THEME}>
      <Component {...pageProps} />
    </ThemeProvider>
  );
}

export default MyApp;
