import React from "react";
import { Body1, Button, makeStyles, Title3, tokens } from "@fluentui/react-components";
import { Cloud24Regular, LockClosed24Regular, Save24Regular } from "@fluentui/react-icons";
import { useGeneralStyles } from "../globals.css";
import { useAuth } from "../context/AuthContext";
import { joinClasses } from "../utils/helpers";

const useStyles = makeStyles({
  contentCard: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
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
    width: "50px",
    height: "50px",
    color: tokens.colorBrandForeground1,
  },
  signInSection: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: "16px",
    textAlign: "center",
    padding: "10px",
    backgroundColor: tokens.colorNeutralBackground1,
    margin: "20px auto 0",
    border: `1px solid ${tokens.colorNeutralStroke1}`,
    borderRadius: tokens.borderRadiusMedium,
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
          <Title3 className={generalStyles.textLeft}>How to use this plugin</Title3>
          <Body1 className={generalStyles.textLeft}>
            After composing your email and adding any attachments, click "Save Email" to securely
            store it in your OneDrive. Emails are saved as HTML in the "Outlook_Plugin_Emails"
            folder, with attachments placed in "Outlook_Plugin_Email_Attachments" and accessible via
            direct links
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
          <Button
            appearance="primary"
            size="large"
            icon={<LockClosed24Regular />}
            onClick={signIn}
            className={joinClasses([generalStyles.textLarge, generalStyles.widthFull])}
          >
            Sign In with Microsoft
          </Button>
        </div>
      )}
    </>
  );
};

export default CardView;
