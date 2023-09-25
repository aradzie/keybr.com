import { type LocaleId } from "@keybr/intl";

export type PageData = {
  /**
   * Base URL.
   */
  readonly base: string;
  /**
   * Active locale identifier.
   */
  readonly locale: LocaleId;
  /**
   * The full details about the currently authenticated user, which include
   * private information such as email, or null if the anonymous is anonymous.
   *
   * This is only visible to the authenticated user.
   */
  readonly user: UserDetails | null;
  /**
   * The current user as is visible to the public.
   *
   * This value does not include any user private information.
   *
   * If the current user is authenticated, then this value is derived from the
   * available user details, or can be anonymized on demand of the user.
   *
   * If the current user is anonymous, then this value is automatically
   * generated.
   */
  readonly publicUser: AnyUser;
  /**
   * Serialized user settings.
   */
  readonly settings: unknown | null;
  /**
   * Serialized user preferences.
   */
  readonly prefs: unknown | null;
  /**
   * Extra attributes which are page-specific.
   */
  readonly extra: PageDataExtra;
};

export type PageDataExtra = {
  /**
   * The user whose profile to display, which may be the current user, or
   * someone else.
   */
  profileOwner?: NamedUser;
};

export type UserDetails = {
  /**
   * Unique id.
   */
  readonly id: string;
  /**
   * Unique e-mail.
   */
  readonly email: string;
  /**
   * User name.
   */
  readonly name: string;
  /**
   * Whether the user name is anonymized.
   */
  readonly anonymized: boolean;
  /**
   * Profiles from social networks.
   */
  readonly externalId: readonly UserExternalIdDetails[];
  /**
   * Premium account order.
   */
  readonly order: OrderDetails | null;
  /**
   * Timestamp.
   */
  readonly createdAt: string | Date;
};

export type UserExternalIdDetails = {
  /**
   * Social network name.
   */
  readonly provider: string;
  /**
   * User id in the social network.
   */
  readonly id: string;
  /**
   * User name in the social network.
   */
  readonly name: string | null;
  /**
   * Profile url.
   */
  readonly url: string | null;
  /**
   * Avatar image url.
   */
  readonly imageUrl: string | null;
  /**
   * Timestamp.
   */
  readonly createdAt: string | Date;
};

export type OrderDetails = {
  /**
   * Order unique id.
   */
  readonly id: string;
  /**
   * Order provider.
   */
  readonly provider: string;
  /**
   * Customer email.
   */
  readonly email: string | null;
  /**
   * Customer name.
   */
  readonly name: string | null;
  /**
   * Timestamp.
   */
  readonly createdAt: string | Date;
};

export type AnonymousUser = {
  /**
   * Anonymous user id.
   */
  readonly id: null;
  /**
   * Anonymous user name.
   */
  readonly name: string;
  /**
   * Image url for avatar.
   */
  readonly imageUrl: null;
};

export type NamedUser = {
  /**
   * Unique user id.
   */
  readonly id: string;
  /**
   * Non-unique user name.
   */
  readonly name: string;
  /**
   * Image url for avatar.
   */
  readonly imageUrl: string | null;
  /**
   * Whether this is a premium user;
   */
  readonly premium: boolean;
};

export type AnyUser = AnonymousUser | NamedUser;
