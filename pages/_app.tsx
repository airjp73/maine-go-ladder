import React from "react";
import { Provider } from "react-redux";
import store from "../store/store";
import { AppPropsType } from "next/dist/next-server/lib/utils";

const App = ({ Component, pageProps }: AppPropsType) => {
  return (
    <Provider store={store}>
      <Component {...pageProps} />
    </Provider>
  );
};

export default App;
