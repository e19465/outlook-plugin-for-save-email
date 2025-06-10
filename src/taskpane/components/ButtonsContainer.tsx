import { Button, makeStyles } from "@fluentui/react-components";
import { Cloud24Regular, Person24Regular } from "@fluentui/react-icons";
import React, { useEffect, useState } from "react";
import LoginDialog from "./LoginDialog";

const useStyles = makeStyles({
  buttonContainer: {
    marginTop: "16px",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: "12px",
    marginBottom: "32px",
    flexWrap: "wrap",
  },
});

const ButtonsContainer: React.FC = () => {
  const styles = useStyles();

  const [signedIn, setSignedIn] = useState<boolean>(!!localStorage.getItem("msPrincipal"));
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setSignedIn(!!localStorage.getItem("msPrincipal"));
    }, 500);

    return () => clearInterval(interval);
  }, []);

  const handleSignOut = () => {
    localStorage.removeItem("msPrincipal");
    setSignedIn(false);
  };

  return (
    <>
      <div className={styles.buttonContainer}>
        {signedIn && (
          <>
            <Button
              appearance="primary"
              icon={<Cloud24Regular />}
              onClick={() => setIsDialogOpen(true)}
            >
              Save Email
            </Button>
            <Button appearance="secondary" icon={<Person24Regular />} onClick={handleSignOut}>
              Sign Out
            </Button>
          </>
        )}
      </div>
      <LoginDialog isDialogOpen={isDialogOpen} setIsDialogOpen={setIsDialogOpen} />
    </>
  );
};

export default ButtonsContainer;
