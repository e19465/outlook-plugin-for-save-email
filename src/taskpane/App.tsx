import React from "react";
import { Button, makeStyles, tokens } from "@fluentui/react-components";
import Header from "./components/Header";
import ButtonsContainer from "./components/ButtonsContainer";
import StatusContainer from "./components/StatusContainer";
import CardView from "./components/CardView";
import { AuthContextProvider } from "./context/AuthContext";
import { WeatherMoon24Regular, WeatherSunny24Regular } from "@fluentui/react-icons";
import { ThemeProps } from "./types/shared";

const useStyles = makeStyles({
  root: {
    minHeight: "100vh",
    backgroundColor: tokens.colorNeutralBackground2,
    fontFamily: "'Segoe UI', sans-serif",
    display: "flex",
    flexDirection: "column",
    padding: "20px",
    gap: "10px",
  },
});

const App: React.FC<ThemeProps> = ({ theme, setTheme }) => {
  const styles = useStyles();
  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <AuthContextProvider>
      <div className={styles.root}>
        <Header theme={theme} setTheme={setTheme} />
        <ButtonsContainer />
        <StatusContainer />
        <CardView />
      </div>
    </AuthContextProvider>
  );
};

export default App;
