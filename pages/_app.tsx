import React from "react";
import { Provider } from "react-redux";
import Head from "next/head";
import store from "../store/store";
import { AppPropsType } from "next/dist/next-server/lib/utils";
import { css, Global } from "@emotion/core";
import { ThemeProvider } from "emotion-theming";
import theme, { Theme } from "../styles/theme";
import opacify from "../styles/opacify";
import "@reach/dialog/styles.css";

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
            html {
              background-color: ${opacify(theme.colors.blue[80], 0.75)};
            }
            html,
            body,
            #__next {
              font-family: Roboto, sans-serif;
              height: 100%;
              margin: 0;
              padding: 0;
            }
          `}
        />
        <Component {...pageProps} />
      </Provider>
    </ThemeProvider>
  );
};

export default App;
