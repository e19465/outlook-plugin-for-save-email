import React from "react";
import { Body1, Button, makeStyles, Title3, tokens } from "@fluentui/react-components";
import { Cloud24Regular, LockClosed24Regular, Save24Regular } from "@fluentui/react-icons";
import { useGeneralStyles } from "../globals.css";
import { useAuth } from "../context/AuthContext";

const useStyles = makeStyles({
  contentCard: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "flex-start",
    gap: "20px",
    backgroundColor: tokens.colorNeutralBackground1,
    borderRadius: tokens.borderRadiusMedium,
    padding: "24px",
    boxShadow: tokens.shadow4,
    maxWidth: "800px",
  },
  featureGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
    gap: "20px",
    marginTop: "24px",
  },
  featureCard: {
    backgroundColor: tokens.colorNeutralBackground1,
    borderRadius: tokens.borderRadiusMedium,
    padding: "16px",
    boxShadow: tokens.shadow2,
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  featureIcon: {
    fontSize: "48px",
    color: tokens.colorBrandForeground1,
  },
  signInSection: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: "24px",
    textAlign: "center",
    maxWidth: "500px",
    margin: "0 auto",
    padding: "0px 10px 40px",
  },
});

const CardView: React.FC = () => {
  const styles = useStyles();
  const generalStyles = useGeneralStyles();
  const { isSignedIn, signIn } = useAuth();

  return (
    <>
      {isSignedIn ? (
        <div className={styles.contentCard}>
          <Title3>How to use this plugin</Title3>
          <Body1>
            Select an email in Outlook and click the "Save Email" button to store it in your
            OneDrive. Your emails will be saved as PDF files with all attachments preserved.
          </Body1>

          <div className={styles.featureGrid}>
            <div className={styles.featureCard}>
              <Cloud24Regular className={styles.featureIcon} />
              <Title3>Cloud Storage</Title3>
              <Body1>Save directly to your OneDrive with secure Microsoft authentication</Body1>
            </div>
            <div className={styles.featureCard}>
              <Save24Regular className={styles.featureIcon} />
              <Title3>Preserve Formatting</Title3>
              <Body1>Emails are saved with original formatting and attachments intact</Body1>
            </div>
            <div className={styles.featureCard}>
              <LockClosed24Regular className={styles.featureIcon} />
              <Title3>Secure</Title3>
              <Body1>Uses Microsoft's secure authentication with enterprise-grade security</Body1>
            </div>
          </div>
        </div>
      ) : (
        <div className={styles.signInSection}>
          <Cloud24Regular className={styles.featureIcon} />
          <Title3 className={generalStyles.textCenter}>Sign in to get started</Title3>
          <Body1 className={generalStyles.textCenter}>
            Connect your Microsoft account to start saving Outlook emails directly to your OneDrive.
            Your credentials are handled securely by Microsoft's authentication system.
          </Body1>
          <Button appearance="primary" size="large" icon={<LockClosed24Regular />} onClick={signIn}>
            Sign In with Microsoft
          </Button>
        </div>
      )}
    </>
  );
};

export default CardView;
