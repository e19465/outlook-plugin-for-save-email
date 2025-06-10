import React from "react";
import { makeStyles, Subtitle1, Title1, tokens } from "@fluentui/react-components";
import { useGeneralStyles } from "../globals.css";
import { joinClasses } from "../utils/helpers";

const useStyles = makeStyles({
  header: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
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
});

const Header: React.FC = () => {
  const styles = useStyles();
  const generalStyles = useGeneralStyles();

  return (
    <header className={styles.header}>
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
