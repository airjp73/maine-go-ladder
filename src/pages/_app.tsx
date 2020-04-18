import React from "react";
import { Provider } from "react-redux";
import Head from "next/head";
import store from "../store/store";
import { AppPropsType } from "next/dist/next-server/lib/utils";
import { css, Global } from "@emotion/core";
import { ThemeProvider } from "emotion-theming";
import theme, { Theme } from "../styles/theme";
import "@reach/dialog/styles.css";
import { AnimatePresence } from "framer-motion";

const App = ({ Component, pageProps, router }: AppPropsType) => {
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
              background-color: ${theme.colors.green[80].hex};
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
        <div
          css={css`
            height: 100%;
            position: relative;
            overflow: hidden;
          `}
        >
          <AnimatePresence initial={false}>
            <Component {...pageProps} key={router.route} />
          </AnimatePresence>
        </div>
      </Provider>
    </ThemeProvider>
  );
};

export default App;
