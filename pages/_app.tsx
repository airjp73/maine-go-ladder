import React from "react";
import { Provider } from "react-redux";
import Head from "next/head";
import store from "../store/store";
import { AppPropsType } from "next/dist/next-server/lib/utils";
import { css, Global } from "@emotion/core";

const App = ({ Component, pageProps }: AppPropsType) => {
  return (
    <Provider store={store}>
      <Head>
        <link
          href="https://fonts.googleapis.com/css2?family=Roboto:wght@300&display=swap"
          rel="stylesheet"
        />
      </Head>
      <Global
        styles={css`
          html,
          body {
            font-family: Roboto, sans-serif;
          }
        `}
      />
      <Component {...pageProps} />
    </Provider>
  );
};

export default App;
