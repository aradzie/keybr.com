import { type User } from "@keybr/database";
import { type AnyUser } from "@keybr/pages-shared";

export type AuthState = {
  readonly sessionId: string;
  readonly user: User | null;
  readonly publicUser: AnyUser;
  readonly requireUser: () => User;
};
