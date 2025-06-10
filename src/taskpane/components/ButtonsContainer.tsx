import { Button, makeStyles } from "@fluentui/react-components";
import { Cloud24Regular, Person24Regular } from "@fluentui/react-icons";
import React, { useEffect, useState } from "react";
import SaveDialog from "./SaveDialog";
import { useAuth } from "../context/AuthContext";

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
            <Button appearance="secondary" icon={<Person24Regular />} onClick={signOut}>
              Sign Out
            </Button>
          </>
        )}
      </div>
      <SaveDialog isDialogOpen={isDialogOpen} setIsDialogOpen={setIsDialogOpen} />
    </>
  );
};

export default ButtonsContainer;
