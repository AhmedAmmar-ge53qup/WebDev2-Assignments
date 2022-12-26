import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "../styles/globals.css";
import Theme from "../themes/theme";


function MyApp({ Component, pageProps }) {

  // Theme mode can be "dark" or "light" (maybe later based on user choice)
  return (
    <QueryClientProvider client={new QueryClient()}>
      <Theme mode="dark">
        <Component {...pageProps} />
      </Theme>
    </QueryClientProvider>
  );
}

export default MyApp;
