import "../styles/globals.css";
import Theme from "../themes/theme";

function MyApp({ Component, pageProps }) {
  return (
    <Theme mode="dark">
      <Component {...pageProps} />
    </Theme>
  );
}

export default MyApp;
