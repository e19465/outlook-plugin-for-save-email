import * as React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { FluentProvider, webLightTheme, webDarkTheme } from "@fluentui/react-components";
import { ThemeType } from "./types/shared";

const rootElement: HTMLElement | null = document.getElementById("container");
const root = rootElement ? createRoot(rootElement) : undefined;

Office.onReady(() => {
  const AppWithTheme = () => {
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const [theme, setTheme] = React.useState<ThemeType>(prefersDark ? "dark" : "light");
    const currentTheme = theme === "dark" ? webDarkTheme : webLightTheme;

    return (
      <FluentProvider theme={currentTheme}>
        <App theme={theme} setTheme={setTheme} />
      </FluentProvider>
    );
  };

  root?.render(<AppWithTheme />);
});

if ((module as any).hot) {
  (module as any).hot.accept("./App", () => {
    const NextApp = require("./App").default;
    root?.render(NextApp);
  });
}
