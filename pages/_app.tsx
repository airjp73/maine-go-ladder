import React from "react";
import { Provider } from "react-redux";
import Head from "next/head";
import store from "../store/store";
import { AppPropsType } from "next/dist/next-server/lib/utils";
import { css, Global } from "@emotion/core";
import { ThemeProvider } from "emotion-theming";
import theme, { Theme } from "../styles/theme";

const App = ({ Component, pageProps }: AppPropsType) => {
  return (
    <ThemeProvider theme={theme}>
      <Provider store={store}>
        <Head>
          <link
            href="https://fonts.googleapis.com/css2?family=Roboto:wght@300&display=swap"
            rel="stylesheet"
          />
        </Head>
        <Global
          styles={(theme: Theme) => css`
            html,
            body {
              font-family: Roboto, sans-serif;
              background-color: ${theme.colors.darkBlue};
            }
          `}
        />
        <Component {...pageProps} />
      </Provider>
    </ThemeProvider>
  );
};

export default App;
