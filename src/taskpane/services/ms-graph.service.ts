import axios, { AxiosResponse } from "axios";
import { MicrosoftGraphUrls, MicrosoftSettings } from "../utils/constants";
import { MicrosoftJwtTokenResponse } from "../types/ms-graph-responses";
import localStorageService from "./local-storage.service";

class MsGraphService {
  private getMicrosoftRedirectUri(): string {
    const params = new URLSearchParams({
      client_id: MicrosoftSettings.clientID ?? "",
      response_type: MicrosoftSettings.responseType,
      redirect_uri: MicrosoftSettings.redirectUrl,
      response_mode: MicrosoftSettings.responseMode,
      scope: MicrosoftSettings.scope.join(" "),
    });
    return `${MicrosoftSettings.loginUrl}?${params.toString()}`;
  }

  async loginWithMsGraph(): Promise<void> {
    const loginUrl = this.getMicrosoftRedirectUri();
    Office.context.ui.displayDialogAsync(loginUrl, { height: 60, width: 40 }, (result) => {
      if (result.status === Office.AsyncResultStatus.Succeeded) {
        const dialog = result.value;
        console.log("Dialog opened successfully");

        dialog.addEventHandler(Office.EventType.DialogMessageReceived, async (arg: any) => {
          const code = arg.message;

          console.log("Authorization code received:", code);

          const tokenUrl = MicrosoftGraphUrls.tokenUrl;
          const params = new URLSearchParams({
            client_id: MicrosoftSettings.clientID ?? "",
            scope: MicrosoftSettings.scope.join(" "),
            code: code ?? "",
            grant_type: "authorization_code",
            redirect_uri: MicrosoftSettings.redirectUrlSuccessfullAuth ?? "",
            client_secret: MicrosoftSettings.clientSecret ?? "",
          });

          let response: AxiosResponse;

          try {
            response = await axios.post(tokenUrl, params.toString(), {
              headers: {
                "Content-Type": "application/x-www-form-urlencoded",
              },
            });
          } catch (error) {
            console.error("Error fetching token:", error);
            dialog.close();
            return;
          }

          if (response.status !== 200) {
            console.error("Failed to fetch token:", response.status, response.statusText);
            dialog.close();
            return;
          }

          console.log("Token response:", response.data);

          const data: MicrosoftJwtTokenResponse = response.data;
          const accessToken = data.access_token;
          const refreshToken = data.refresh_token;

          localStorageService.setItemToLocalStorage("msAccessToken", accessToken);
          localStorageService.setItemToLocalStorage("msRefreshToken", refreshToken);

          dialog.close();
        });

        dialog.addEventHandler(Office.EventType.DialogEventReceived, (arg) => {
          console.error("Dialog closed or error:", arg);
        });
      } else {
        console.error("Failed to open dialog:", result.error);
      }
    });
  }
}

const msGraphService = new MsGraphService();
export default msGraphService;
