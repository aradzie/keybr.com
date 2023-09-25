import { AbstractAdapter } from "../../adapter.ts";
import { type ResourceOwner } from "../../resource-owner.ts";
import { type ClientConfig } from "../../types.ts";
import { type MicrosoftProfileResponse } from "./types.ts";

const authorizationUri =
  "https://login.microsoftonline.com/consumers/oauth2/v2.0/authorize";
const tokenUri =
  "https://login.microsoftonline.com/consumers/oauth2/v2.0/token";
const profileUri = "https://graph.microsoft.com/v1.0/me";

export class MicrosoftAdapter extends AbstractAdapter {
  constructor(config: ClientConfig) {
    super(config, { authorizationUri, tokenUri, profileUri });
  }

  protected parseProfileResponse(
    response: MicrosoftProfileResponse,
  ): ResourceOwner<MicrosoftProfileResponse> {
    const { id, userPrincipalName, displayName } = response;
    return {
      raw: response,
      provider: "microsoft",
      id: id,
      email: userPrincipalName || null,
      name: displayName || null,
      url: null,
      imageUrl: null,
    };
  }
}
