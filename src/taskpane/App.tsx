import React, { useEffect, useState } from "react";
import { makeStyles, Spinner, tokens } from "@fluentui/react-components";
import Header from "./components/Header";
import ButtonsContainer from "./components/ButtonsContainer";
import StatusContainer from "./components/StatusContainer";
import CardView from "./components/CardView";
import { useAuth } from "./context/AuthContext";
import { ThemeProps } from "./types/shared";
import msGraphService from "./services/ms-graph.service";

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
  loadingContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
  },
  loadingText: {
    marginLeft: "10px",
    fontSize: "16px",
    color: tokens.colorNeutralForeground1,
  },
});

const App: React.FC<ThemeProps> = ({ theme, setTheme }) => {
  const styles = useStyles();
  const { signOut } = useAuth();
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        setLoading(true);
        await msGraphService.checkAuthenticationStatus();
      } catch (error) {
        console.log("Authentication check failed: ", error);
        signOut();
      } finally {
        setLoading(false);
      }
    };
    checkAuthStatus();
  }, []);

  return (
    <div className={styles.root}>
      <Header theme={theme} setTheme={setTheme} />
      {loading ? (
        <div className={styles.loadingContainer}>
          <Spinner label="Loading..." size="medium" />
        </div>
      ) : (
        <>
          <ButtonsContainer />
          <StatusContainer />
          <CardView />
        </>
      )}
    </div>
  );
};

export default App;
