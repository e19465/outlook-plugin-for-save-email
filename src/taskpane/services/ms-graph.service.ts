import { Axios, AxiosError, AxiosResponse } from "axios";
import { CUSTOM_MS_ERROR_CODES_FOR_PLUGIN, MicrosoftRedirectUrls } from "../utils/constants";
import { MicrosoftLoginResponse } from "../types/ms-graph-responses";
import localStorageService from "./local-storage.service";
import axiosClient from "../config/axios-client";
import { getAsyncProperty, getAttachmentAsFile } from "../utils/helpers";

class MsGraphService {
  /**
   * Retrieves the Microsoft authentication redirect URI from the backend service.
   *
   * Sends a GET request to the `/ms-graph/auth/login` endpoint with the specified
   * redirect URL as a query parameter. Returns the redirect URI provided in the response.
   *
   * @returns {Promise<string>} A promise that resolves to the Microsoft redirect URI.
   * @throws Will throw an error if the request fails.
   */
  private async getMicrosoftRedirectUri(): Promise<string> {
    try {
      const response = await axiosClient.get(
        `/ms-graph/auth/login?redirect=${MicrosoftRedirectUrls.loginRedirectUrl}`
      );
      return response.data.data.redirectUri;
    } catch (error) {
      console.error("Error constructing Microsoft redirect URI:", error);
      throw error;
    }
  }

  /**
   * Initiates the Microsoft Graph login flow using an Office dialog.
   *
   * This method opens a dialog window for the user to authenticate with Microsoft.
   * Upon successful authentication, it receives an authorization code, exchanges it
   * for tokens via a backend endpoint, and stores the authenticated user's email in local storage.
   *
   * The dialog communicates with the add-in via message passing. On successful authentication,
   * a success message is sent to the dialog child. Handles dialog closure and error scenarios.
   *
   * @returns {Promise<void>} A promise that resolves when the login process completes or fails.
   *
   * @throws Will log errors to the console if the dialog fails to open, if token exchange fails,
   *         or if any unexpected error occurs during the login process.
   */
  async loginWithMsGraph(): Promise<void> {
    try {
      const loginUrl = await this.getMicrosoftRedirectUri();

      Office.context.ui.displayDialogAsync(loginUrl, { height: 60, width: 40 }, (result) => {
        if (result.status === Office.AsyncResultStatus.Succeeded) {
          const dialog = result.value;

          dialog.addEventHandler(Office.EventType.DialogMessageReceived, async (arg: any) => {
            const code = arg.message;

            let response: AxiosResponse;

            try {
              response = await axiosClient.post("/ms-graph/auth/obtain-tokens-outlook-plugin", {
                code,
                redirect: MicrosoftRedirectUrls.loginRedirectUrl,
              });
            } catch (error) {
              console.error("Error fetching token:", error);
              if (
                error instanceof AxiosError &&
                error.response.data?.message === CUSTOM_MS_ERROR_CODES_FOR_PLUGIN.EmailNotPermitted
              ) {
                dialog.messageChild(MicrosoftRedirectUrls.redirectUrlEmailNotPermitted);
              } else {
                dialog.messageChild(MicrosoftRedirectUrls.redirectUrlError);
              }
            }

            const data: MicrosoftLoginResponse = response.data.data;
            const email = data.email;
            localStorageService.setItemToLocalStorage("msPrincipal", email);

            dialog.messageChild(MicrosoftRedirectUrls.redirectUrlSuccessfullAuth);
            // dialog.close();
          });

          dialog.addEventHandler(Office.EventType.DialogEventReceived, (arg) => {
            console.error("Dialog closed or error:", arg);
          });
        } else {
          console.error("Failed to open dialog:", result.error);
        }
      });
    } catch (err) {
      console.log("Error during Microsoft Graph login:", err);
      throw err;
    }
  }

  /**
   * Copies the current email's data and sends it to the backend server.
   *
   * This function collects various properties from the current Outlook email item,
   * including subject, sender, recipients, body (HTML), creation date, and attachments.
   * It then constructs a `FormData` object containing these properties, along with the
   * user's principal (email address) retrieved from local storage. Attachments are
   * processed and appended to the form data as files.
   *
   * The function sends the collected data to the backend endpoint `/ms-graph/upload-email-to-cloud`
   * using a POST request with `multipart/form-data` encoding.
   *
   * @async
   * @returns {Promise<void>} Resolves when the email data has been successfully sent to the backend.
   * @throws Will log an error to the console if any step in the process fails.
   */
  async copyAndSendEmailToBackend() {
    try {
      const formData = new FormData();
      const item = Office.context.mailbox.item;

      // collecting properties from the item
      const subject = await getAsyncProperty(item.subject);
      const from = (await getAsyncProperty(item.from))?.emailAddress || "";
      const toRecipients = (await getAsyncProperty(item.to))?.map((r) => r.emailAddress) || [];
      const ccRecipients = (await getAsyncProperty(item.cc))?.map((r) => r.emailAddress) || [];
      const bodyHtml = await getAsyncProperty(item.body, Office.CoercionType.Html);
      const formattedDate = new Date(
        item.dateTimeCreated || new Date().toISOString()
      ).toISOString();

      // Get attachments - COMPOSE MODE SPECIFIC
      const attachments = await new Promise<Office.AttachmentDetailsCompose[]>(
        (resolve, reject) => {
          item.getAttachmentsAsync((result) => {
            if (result.status === Office.AsyncResultStatus.Succeeded) {
              resolve(result.value);
            } else {
              reject(result.error);
            }
          });
        }
      );

      // Getting user principle (email of user)
      const userPrincipal = localStorageService.getItemFromLocalStorage("msPrincipal");

      formData.append("userPrincipal", userPrincipal || "");
      formData.append("subject", subject);
      formData.append("from", from);
      formData.append("toRecipients", JSON.stringify(toRecipients));
      formData.append("ccRecipients", JSON.stringify(ccRecipients));
      formData.append("date", formattedDate);
      formData.append("bodyHtml", bodyHtml);

      for (const attachment of attachments) {
        const file = await getAttachmentAsFile(attachment);
        formData.append("attachments", file);
      }

      await axiosClient.post("/ms-graph/upload-email-to-cloud", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log("Email data sent successfully.");
    } catch (error) {
      console.error("Error during save operation:", error);
      throw error;
    }
  }

  async checkAuthenticationStatus(): Promise<boolean> {
    try {
      await axiosClient.post("/ms-graph/auth/check-authentication-status", {
        email: localStorageService.getItemFromLocalStorage("msPrincipal"),
      });
      return true;
    } catch (error) {
      console.error("Error checking authentication status:", error);
      return false;
    }
  }
}

const msGraphService = new MsGraphService();
export default msGraphService;
