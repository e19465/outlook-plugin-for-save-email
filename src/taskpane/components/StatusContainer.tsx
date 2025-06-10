import { Body1, makeStyles, tokens } from "@fluentui/react-components";
import { Mail24Regular, Person24Regular } from "@fluentui/react-icons";
import React, { useEffect, useState } from "react";

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
  const [signedIn, setSignedIn] = useState<boolean>(!!localStorage.getItem("msPrincipal"));

  useEffect(() => {
    const interval = setInterval(() => {
      setSignedIn(!!localStorage.getItem("msPrincipal"));
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className={styles.statusContainer}>
      {signedIn ? (
        <>
          <Mail24Regular className={styles.featureIcon} />
          <Body1>
            Welcome, <strong>{localStorage.getItem("msPrincipal") || "User"}</strong>
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
