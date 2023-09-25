export type FacebookErrorResponse = {
  readonly error: {
    readonly message: string;
    readonly type: "OAuthException";
    readonly code: number;
    readonly error_subcode: number;
  };
};

export type FacebookProfileResponse = {
  readonly id: string;
  readonly email?: string;
  readonly name?: string;
  readonly first_name?: string;
  readonly last_name?: string;
  readonly picture?: {
    readonly data?: {
      readonly url?: string;
      readonly width?: number;
      readonly height?: number;
      readonly is_silhouette?: boolean;
    };
  };
};
