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
import { Dismiss24Regular, SignOut24Regular } from "@fluentui/react-icons";
import React, { Dispatch } from "react";
import { useGeneralStyles } from "../globals.css";

interface SignOutDialogProps {
  isDialogOpen: boolean;
  setIsDialogOpen: Dispatch<React.SetStateAction<boolean>>;
  handleAccept: () => void;
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

const SignOutDialog: React.FC<SignOutDialogProps> = ({
  isDialogOpen,
  setIsDialogOpen,
  handleAccept,
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
              <SignOut24Regular />
              <span className={generalStyles.textLarge}>Sign Out</span>
            </div>
          </DialogTitle>
          <DialogContent>
            <Body1>
              This will sign you out from the plugin, You have to sign in again to save an email
            </Body1>
            {/* Add form elements here for file naming and location selection */}
          </DialogContent>
          <DialogActions>
            <Button appearance="secondary" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button appearance="primary" onClick={handleAccept}>
              Logout
            </Button>
          </DialogActions>
        </DialogBody>
      </DialogSurface>
    </Dialog>
  );
};

export default SignOutDialog;
