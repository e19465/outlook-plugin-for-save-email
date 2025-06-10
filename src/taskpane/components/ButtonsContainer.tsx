import { Button, makeStyles } from "@fluentui/react-components";
import { Cloud24Regular, Person24Regular } from "@fluentui/react-icons";
import React, { useEffect, useState } from "react";
import SaveDialog from "./SaveDialog";
import { useAuth } from "../context/AuthContext";
import SignOutDialog from "./SignOutDialog";

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
  const { isSignedIn, signOut } = useAuth();
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [isMailSaving, setIsMailSaving] = useState<boolean>(false);
  const [isSignOutDialogOpen, setIsSignOutDialogOpen] = useState<boolean>(false);

  const handleSave = () => {
    setIsMailSaving(true);
    console.log("executed save");
    setIsMailSaving(false);
  };

  const handleSignOut = () => {
    signOut();
    setIsSignOutDialogOpen(false);
  };

  return (
    <>
      <div className={styles.buttonContainer}>
        {isSignedIn && (
          <>
            <Button
              appearance="primary"
              icon={<Cloud24Regular />}
              onClick={() => setIsDialogOpen(true)}
            >
              Save Email
            </Button>
            <Button
              appearance="secondary"
              icon={<Person24Regular />}
              onClick={() => setIsSignOutDialogOpen(true)}
            >
              Sign Out
            </Button>
          </>
        )}
      </div>
      <SaveDialog
        isDialogOpen={isDialogOpen}
        setIsDialogOpen={setIsDialogOpen}
        handleAccept={handleSave}
        isMailSaving={isMailSaving}
      />
      <SignOutDialog
        isDialogOpen={isSignOutDialogOpen}
        setIsDialogOpen={setIsSignOutDialogOpen}
        handleAccept={handleSignOut}
      />
    </>
  );
};

export default ButtonsContainer;
