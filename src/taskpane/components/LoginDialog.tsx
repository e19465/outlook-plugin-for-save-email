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
} from "@fluentui/react-components";
import { Dismiss24Regular, Save24Regular } from "@fluentui/react-icons";
import React, { Dispatch } from "react";

interface LoginDialogProps {
  isDialogOpen: boolean;
  setIsDialogOpen: Dispatch<React.SetStateAction<boolean>>;
}

const LoginDialog: React.FC<LoginDialogProps> = ({ isDialogOpen, setIsDialogOpen }) => {
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
            <Save24Regular /> Save Email to OneDrive
          </DialogTitle>
          <DialogContent>
            <Body1>
              This will save the currently selected email to your OneDrive as a PDF file with all
              attachments. Choose a location and file name below.
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

export default LoginDialog;
