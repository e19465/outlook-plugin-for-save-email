import React from "react";
import { makeStyles } from "@fluentui/react-components";

const useStyles = makeStyles({
  root: {
    width: "100%",
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f3f2f1",
    padding: "20px",
  },
});

const AuthSuccessView: React.FC = () => {
  const styles = useStyles();
  return (
    <div className={styles.root}>
      <h1>Authentication Successful</h1>
      <p>You have successfully signed in.</p>
      <p>You can close this page now</p>
    </div>
  );
};

export default AuthSuccessView;
