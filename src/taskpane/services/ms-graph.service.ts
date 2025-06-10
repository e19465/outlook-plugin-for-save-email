import { AxiosResponse } from "axios";
import { MicrosoftSettings } from "../utils/constants";
import { MicrosoftLoginResponse } from "../types/ms-graph-responses";
import localStorageService from "./local-storage.service";
import axiosClient from "../config/axios-client";
import { getAttachmentAsFile, getComposeAttachmentContent } from "../utils/helpers";

class MsGraphService {
  private async getMicrosoftRedirectUri(): Promise<string> {
    try {
      const response = await axiosClient.get(
        `/ms-graph/auth/login?redirect=${MicrosoftSettings.loginRedirectUrl}`
      );
      return response.data.data.redirectUri;
    } catch (error) {
      console.error("Error constructing Microsoft redirect URI:", error);
      throw error;
    }
  }

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
                redirect: MicrosoftSettings.loginRedirectUrl,
              });
            } catch (error) {
              console.error("Error fetching token:", error);
              dialog.close();
              return;
            }

            const data: MicrosoftLoginResponse = response.data.data;
            const email = data.email;
            localStorageService.setItemToLocalStorage("msPrincipal", email);

            dialog.messageChild(MicrosoftSettings.redirectUrlSuccessfullAuth);
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
    }
  }

  async copyAndSendEmailToBackend() {
    try {
      const formData = new FormData();
      const item = Office.context.mailbox.item;

      // Subject
      const subject = await new Promise<string>((resolve, reject) => {
        item.subject.getAsync((result) => {
          result.status === Office.AsyncResultStatus.Succeeded
            ? resolve(result.value)
            : reject(result.error);
        });
      });

      // Sender (alternative to headers)
      const from = await new Promise<string>((resolve, reject) => {
        item.from.getAsync((result) => {
          result.status === Office.AsyncResultStatus.Succeeded
            ? resolve(result.value.emailAddress)
            : reject(result.error);
        });
      });

      // Recipients (alternative to headers)
      const toRecipients = await new Promise<string[]>((resolve, reject) => {
        item.to.getAsync((result) => {
          result.status === Office.AsyncResultStatus.Succeeded
            ? resolve(result.value.map((recipient) => recipient.emailAddress))
            : reject(result.error);
        });
      });

      const ccRecipients = await new Promise<string[]>((resolve, reject) => {
        item.cc.getAsync((result) => {
          result.status === Office.AsyncResultStatus.Succeeded
            ? resolve(result.value.map((recipient) => recipient.emailAddress))
            : reject(result.error);
        });
      });

      // Date
      const dateTimeCreated = item.dateTimeCreated || new Date().toISOString();
      const formattedDate = new Date(dateTimeCreated).toISOString();

      // Body HTML
      const bodyHtml = await new Promise<string>((resolve, reject) => {
        item.body.getAsync(Office.CoercionType.Html, (result) => {
          result.status === Office.AsyncResultStatus.Succeeded
            ? resolve(result.value)
            : reject(result.error);
        });
      });

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

      // Attachments
      const attachmentContents = await Promise.all(
        attachments.map((att) => getComposeAttachmentContent(att.id))
      );

      const payload = {
        subject,
        from,
        toRecipients,
        ccRecipients,
        formattedDate,
        bodyHtml,
        attachments: attachments.map((att, index) => ({
          name: att.name,
          contentType: att.attachmentType || "application/octet-stream",
          contentBytes: attachmentContents[index],
        })),
      };

      const userPrincipal = localStorageService.getItemFromLocalStorage("msPrincipal");

      formData.append("subject", subject);
      formData.append("from", from);
      formData.append("toRecipients", JSON.stringify(toRecipients));
      formData.append("ccRecipients", JSON.stringify(ccRecipients));
      formData.append("date", formattedDate);
      formData.append("bodyHtml", bodyHtml);
      formData.append("userPrincipal", userPrincipal || "");

      for (const attachment of attachments) {
        const file = await getAttachmentAsFile(attachment);
        formData.append("attachments", file, file.name);
      }

      await axiosClient.post("/ms-graph/upload-email-to-cloud", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log("Email data sent successfully.");
    } catch (error) {
      console.error("Error during save operation:", error);
    }
  }
}

const msGraphService = new MsGraphService();
export default msGraphService;
