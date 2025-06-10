import React from "react";
import { makeStyles, tokens } from "@fluentui/react-components";
import Header from "./components/Header";
import ButtonsContainer from "./components/ButtonsContainer";
import StatusContainer from "./components/StatusContainer";
import CardView from "./components/CardView";

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

const App: React.FC = () => {
  const styles = useStyles();

  return (
    <div className={styles.root}>
      <Header />
      <ButtonsContainer />
      <StatusContainer />
      <CardView />
    </div>
  );
};

export default App;
