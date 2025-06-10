import React, { useState } from "react";
import { makeStyles } from "@fluentui/react-components";
import { Ribbon24Regular, LockOpen24Regular, DesignIdeas24Regular } from "@fluentui/react-icons";
import msGraphService from "./services/ms-graph.service";

const useStyles = makeStyles({
  root: {
    minHeight: "100vh",
  },
  modelContainer: {
    position: "fixed",
    top: 0,
    left: 0,
    height: "100vh",
    width: "100vw",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    zIndex: 1000,
  },
  model: {
    backgroundColor: "#fff",
    padding: "20px",
    borderRadius: "8px",
    boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
    minWidth: "300px",
    textAlign: "center",
  },
  buttonContainer: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "10px",
  },
  button: {
    marginTop: "20px",
    padding: "10px 20px",
    backgroundColor: "#0078d4",
    color: "#ffffff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "16px",
  },
  textRed: {
    color: "red",
  },
  textGreen: {
    color: "green",
  },
});

const App: React.FC = () => {
  const [signedIn, setSignedIn] = useState<boolean>(localStorage.getItem("SignedIn") === "true");
  const [isModelOpen, setIsModelOpen] = useState<boolean>(false);
  const styles = useStyles();

  const handleSignIn = async () => {
    setSignedIn(true);
    try {
      console.log("Signing in...");
      await msGraphService.loginWithMsGraph();
    } catch (err: any) {
      console.log("Something went wrong while signing in:", err);
    }
  };

  const handleSignOut = () => {
    setSignedIn(false);
    localStorage.removeItem("SignedIn");
  };

  const openModel = () => {
    setIsModelOpen(true);
  };

  const closeModel = () => {
    setIsModelOpen(false);
  };

  return (
    <div className={styles.root}>
      <div className={styles.buttonContainer}>
        <button className={styles.button} onClick={handleSignIn}>
          Sign In
        </button>
        <button className={styles.button} onClick={handleSignOut}>
          Sign Out
        </button>
        <button className={styles.button} onClick={openModel}>
          Open Modal
        </button>
      </div>
      {signedIn && <p className={styles.textGreen}>You have successfully signed in</p>}
      {!signedIn && <p className={styles.textRed}>You have successfully signed out</p>}
      {isModelOpen && (
        <div className={styles.modelContainer} onClick={closeModel}>
          <div className={styles.model} onClick={(e) => e.stopPropagation()}>
            <h2>Modal Title</h2>
            <p>This is some modal text. You can add a textarea or input as needed.</p>
            <div className={styles.buttonContainer}>
              <button className={styles.button} onClick={() => alert("Saved!")}>
                Save
              </button>
              <button className={styles.button} onClick={closeModel}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
