"use client";
import "./globals.css";
import Theme from "../themes/theme";
import { QueryClient, QueryClientProvider } from "react-query";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      {/*
        <head /> will contain the components returned by the nearest parent
        head.jsx. Find out more at https://beta.nextjs.org/docs/api-reference/file-conventions/head
      */}
      <head />
      <body>
        <QueryClientProvider client={new QueryClient()}>
          <Theme mode="dark">{children}</Theme>
        </QueryClientProvider>
      </body>
    </html>
  );
}
