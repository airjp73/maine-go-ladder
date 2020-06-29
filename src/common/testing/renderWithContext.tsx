import * as React from "react";
import { ThemeProvider } from "emotion-theming";
import { render } from "@testing-library/react";
import theme from "../styles/theme";
import { Provider } from "react-redux";
import { createStore } from "../../core/store";

function renderWithContext(
  children: React.ReactNode
): ReturnType<typeof render> {
  const store = createStore();
  return render(
    <ThemeProvider theme={theme}>
      <Provider store={store}>{children}</Provider>
    </ThemeProvider>
  );
}

export default renderWithContext;
