import { type PatchAccountRequest } from "./browser/service.ts";

export type AccountActions = {
  readonly patchAccount: (request: PatchAccountRequest) => void;
  readonly deleteAccount: () => void;
  readonly logout: () => void;
  readonly checkout: () => void;
};

export type SignInActions = {
  readonly registerEmail: (email: string) => Promise<unknown>;
};
