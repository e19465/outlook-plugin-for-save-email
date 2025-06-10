import { AxiosResponse } from "axios";
import { MicrosoftSettings } from "../utils/constants";
import { MicrosoftLoginResponse } from "../types/ms-graph-responses";
import localStorageService from "./local-storage.service";
import axiosClient from "../config/axios-client";

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
}

const msGraphService = new MsGraphService();
export default msGraphService;
