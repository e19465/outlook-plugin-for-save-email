import { MICROSOFT_CLIENT_ID, MICROSOFT_CLIENT_SECRET, MICROSOFT_TENANT_ID } from "../dotenv-load";

export const MicrosoftSettings = {
  clientID: MICROSOFT_CLIENT_ID,
  tenantID: MICROSOFT_TENANT_ID,
  clientSecret: MICROSOFT_CLIENT_SECRET,
  identityMetadata: `https://login.microsoftonline.com/${MICROSOFT_TENANT_ID}/v2.0/.well-known/openid-configuration`,
  loginUrl: `https://login.microsoftonline.com/${MICROSOFT_TENANT_ID}/oauth2/v2.0/authorize`,
  responseType: "code",
  responseMode: "query",
  redirectUrl: `https://localhost:3000/redirect.html`,
  redirectUrlSuccessfullAuth: "https://localhost:3000/authentication_successfull.html",
  allowHttpForRedirectUrl: true,
  scope: [
    "openid",
    "profile",
    "email",
    "offline_access",
    "User.Read",
    "Files.ReadWrite",
    "Mail.ReadWrite",
    "Mail.Send",
  ],
};

export const MicrosoftGraphUrls = {
  accountDetailsUrl: "https://graph.microsoft.com/v1.0/me",
  tokenUrl: "https://login.microsoftonline.com/common/oauth2/v2.0/token",
};
