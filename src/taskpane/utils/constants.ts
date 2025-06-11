export const MicrosoftRedirectUrls = {
  loginRedirectUrl: `${process.env.REACT_APP_FRONTEND_BASE_URL}/redirect.html`,
  redirectUrlSuccessfullAuth: `${process.env.REACT_APP_FRONTEND_BASE_URL}/authentication_successful.html`,
  redirectUrlError: `${process.env.REACT_APP_FRONTEND_BASE_URL}/microsoft_authentication_error.html`,
  redirectUrlEmailNotPermitted: `${process.env.REACT_APP_FRONTEND_BASE_URL}/email_not_permitted.html`,
};

export const MicrosoftGraphUrls = {
  accountDetailsUrl: "https://graph.microsoft.com/v1.0/me",
  tokenUrl: "https://login.microsoftonline.com/common/oauth2/v2.0/token",
};

export const CUSTOM_MS_ERROR_CODES_FOR_PLUGIN = {
  EmailNotPermitted: "EmailNotPermitted",
};
