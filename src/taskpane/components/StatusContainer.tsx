import React from "react";
import { Body1, makeStyles, tokens } from "@fluentui/react-components";
import { Mail24Regular, Person24Regular } from "@fluentui/react-icons";
import { useAuth } from "../context/AuthContext";

const useStyles = makeStyles({
  statusContainer: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  featureIcon: {
    fontSize: "24px",
    color: tokens.colorBrandForeground1,
  },
});

const StatusContainer: React.FC = () => {
  const styles = useStyles();
  const { isSignedIn, userPrincipal } = useAuth();

  return (
    <div className={styles.statusContainer}>
      {isSignedIn ? (
        <>
          <Mail24Regular className={styles.featureIcon} />
          <Body1>
            Welcome, <strong>{userPrincipal || ""}</strong>
          </Body1>
        </>
      ) : (
        <>
          <Person24Regular className={styles.featureIcon} />
          <Body1>You are currently signed out</Body1>
        </>
      )}
    </div>
  );
};

export default StatusContainer;
