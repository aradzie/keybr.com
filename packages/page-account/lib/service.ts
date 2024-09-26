import { type AnyUser, type UserDetails } from "@keybr/pages-shared";
import { expectType, request } from "@keybr/request";

export type PatchAccountRequest = {
  readonly anonymized: boolean;
};

export type PatchAccountResponse = {
  readonly user: UserDetails;
  readonly publicUser: AnyUser;
};

export namespace AccountService {
  export async function registerEmail(email: string): Promise<unknown> {
    const response = await request
      .use(expectType("application/json"))
      .POST("/auth/login/register-email")
      .send({ email });
    return await response.json();
  }

  export async function patchAccount(
    data: PatchAccountRequest,
  ): Promise<PatchAccountResponse> {
    const response = await request
      .use(expectType("application/json"))
      .PATCH("/_/account")
      .send(data);
    return await response.json();
  }

  export async function deleteAccount(): Promise<void> {
    const response = await request.DELETE("/_/account").send();
    await response.blob(); // Ignore.
  }
}
