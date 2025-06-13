import {
  Dialog,
  DialogSurface,
  DialogBody,
  DialogTitle,
  DialogTrigger,
  Button,
  DialogContent,
  Body1,
  DialogActions,
  makeStyles,
} from "@fluentui/react-components";
import { Dismiss24Regular, Save24Regular } from "@fluentui/react-icons";
import React, { Dispatch } from "react";
import { useGeneralStyles } from "../globals.css";
import { joinClasses } from "../utils/helpers";

interface SaveDialogProps {
  isDialogOpen: boolean;
  setIsDialogOpen: Dispatch<React.SetStateAction<boolean>>;
  handleAccept: () => void;
  isMailSaving: boolean;
  isError: boolean;
}

const useStyles = makeStyles({
  header: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: "10px",
  },
  saveTextContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  errorTextContainer: {
    backgroundColor: "#fdf6f6",
    textAlign: "center",
    padding: "0 10px",
  },
});

const SaveDialog: React.FC<SaveDialogProps> = ({
  isDialogOpen,
  setIsDialogOpen,
  handleAccept,
  isMailSaving,
  isError,
}) => {
  const styles = useStyles();
  const generalStyles = useGeneralStyles();

  return (
    <Dialog open={isDialogOpen} onOpenChange={(_, { open }) => setIsDialogOpen(open)}>
      <DialogSurface>
        <DialogBody>
          <DialogTitle
            action={
              <DialogTrigger action="close">
                <Button appearance="subtle" aria-label="close" icon={<Dismiss24Regular />} />
              </DialogTrigger>
            }
          >
            <div className={styles.header}>
              <Save24Regular />
              <span className={generalStyles.textLarge}>Save Email to OneDrive</span>
            </div>
          </DialogTitle>
          <DialogContent>
            <Body1 className={styles.saveTextContainer}>
              <div className={generalStyles.textCenter}>
                This will save the current email to your OneDrive as a HTML file with all
                attachments.
              </div>
              {isError && (
                <div className={styles.errorTextContainer}>
                  <span
                    className={joinClasses([generalStyles.errorText, generalStyles.textCenter])}
                  >
                    An error occurred while saving the email. Please try again.
                  </span>
                </div>
              )}
            </Body1>
          </DialogContent>
          <DialogActions>
            <Button appearance="secondary" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button appearance="primary" onClick={handleAccept}>
              {isMailSaving ? "Saving..." : "Save to OneDrive"}
            </Button>
          </DialogActions>
        </DialogBody>
      </DialogSurface>
    </Dialog>
  );
};

export default SaveDialog;
