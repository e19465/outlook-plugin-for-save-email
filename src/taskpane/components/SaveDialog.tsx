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

interface SaveDialogProps {
  isDialogOpen: boolean;
  setIsDialogOpen: Dispatch<React.SetStateAction<boolean>>;
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
});

const SaveDialog: React.FC<SaveDialogProps> = ({ isDialogOpen, setIsDialogOpen }) => {
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
            <Body1>
              This will save the current email to your OneDrive as a PDF file with all attachments.
            </Body1>
            {/* Add form elements here for file naming and location selection */}
          </DialogContent>
          <DialogActions>
            <Button appearance="secondary" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              appearance="primary"
              onClick={() => {
                alert("Email saved successfully!");
                setIsDialogOpen(false);
              }}
            >
              Save to OneDrive
            </Button>
          </DialogActions>
        </DialogBody>
      </DialogSurface>
    </Dialog>
  );
};

export default SaveDialog;
