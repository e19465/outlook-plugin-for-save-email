import React from "react";
import { Button, makeStyles, Subtitle1, Title1, tokens } from "@fluentui/react-components";
import { useGeneralStyles } from "../globals.css";
import { joinClasses } from "../utils/helpers";
import { WeatherMoon24Regular, WeatherSunny24Regular } from "@fluentui/react-icons";
import { ThemeProps } from "../types/shared";

const useStyles = makeStyles({
  header: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
    position: "relative",
  },
  logoContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: "12px",
  },
  logo: {
    height: "100px",
    width: "100px",
    objectFit: "contain",
  },
  toggleButton: {
    position: "absolute",
    top: "5px",
    right: "5px",
  },
});

const Header: React.FC<ThemeProps> = ({ theme, setTheme }) => {
  const styles = useStyles();
  const generalStyles = useGeneralStyles();

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <header className={styles.header}>
      <Button
        icon={theme === "light" ? <WeatherMoon24Regular /> : <WeatherSunny24Regular />}
        onClick={toggleTheme}
        appearance="primary"
        className={styles.toggleButton}
      ></Button>
      <div className={styles.logoContainer}>
        <img src="/assets/logo.png" alt="Plugin Logo" className={styles.logo} />
        <Title1 className={generalStyles.textCenter}>Outlook to OneDrive</Title1>
      </div>
      <Subtitle1 className={joinClasses([generalStyles.textCenter, generalStyles.textMedium])}>
        A secure solution to save and organize your Outlook emails directly to OneDrive
      </Subtitle1>
    </header>
  );
};

export default Header;
