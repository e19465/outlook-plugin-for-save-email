import { Button, makeStyles, tokens } from "@fluentui/react-components";
import { Cloud24Regular, Person24Regular, Dismiss24Regular } from "@fluentui/react-icons";
import React, { useState } from "react";
import SaveDialog from "./SaveDialog";
import { useAuth } from "../context/AuthContext";
import SignOutDialog from "./SignOutDialog";
import msGraphService from "../services/ms-graph.service";
import { useGeneralStyles } from "../globals.css";
import { joinClasses } from "../utils/helpers";

const useStyles = makeStyles({
  buttonContainer: {
    marginTop: "16px",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: "12px",
    flexWrap: "wrap",
  },
  saveSuccessMessageContainer: {
    padding: "5px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "10px",
    backgroundColor: tokens.colorPaletteGreenForeground1,
    borderRadius: "4px",
  },
  saveSuccessMessage: {
    color: "#2ECC71",
  },
});

const ButtonsContainer: React.FC = () => {
  const styles = useStyles();
  const generalStyles = useGeneralStyles();
  const { isSignedIn, signOut } = useAuth();
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [isMailSaving, setIsMailSaving] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);
  const [isSuccessMessageVisible, setIsSuccessMessageVisible] = useState<boolean>(false);
  const [isSignOutDialogOpen, setIsSignOutDialogOpen] = useState<boolean>(false);

  const handleSave = async () => {
    try {
      setIsError(false);
      setIsSuccessMessageVisible(false);
      setIsMailSaving(true);
      await msGraphService.copyAndSendEmailToBackend();
      setIsDialogOpen(false);
      setIsSuccessMessageVisible(true);
    } catch (error) {
      console.error("Error during save operation:", error);
      setIsError(true);
    } finally {
      setIsMailSaving(false);
    }
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
      {isSuccessMessageVisible && (
        <div className={styles.saveSuccessMessageContainer}>
          <span
            className={
              joinClasses[
                (generalStyles.textCenter, generalStyles.textSmall, styles.saveSuccessMessage)
              ]
            }
          >
            Email Saved Successfully
          </span>
          <Button
            appearance="secondary"
            onClick={() => setIsSuccessMessageVisible(false)}
            className={generalStyles.textSmall}
            icon={<Dismiss24Regular />}
            aria-label="Dismiss Save Success Message"
          />
        </div>
      )}
      <SaveDialog
        isDialogOpen={isDialogOpen}
        setIsDialogOpen={setIsDialogOpen}
        handleAccept={handleSave}
        isMailSaving={isMailSaving}
        isError={isError}
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
