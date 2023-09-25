export type ClientConfig = {
  readonly clientId: string;
  readonly clientSecret: string;
  readonly redirectUri: string;
  readonly scope: string;
};

export type AdapterConfig = {
  readonly authorizationUri: string;
  readonly tokenUri: string;
  readonly profileUri: string;
};

/**
 * @see https://www.rfc-editor.org/rfc/rfc6749#section-5.1
 *
 * The authorization server issues an access token and optional refresh token,
 * and constructs the response by adding the following parameters
 * to the entity-body of the HTTP response with a 200 (OK) status code
 * The parameters are included in the entity-body of the HTTP response
 * using the `"application/json"` media type
 */
export type TokenResponse = {
  /**
   * The access token issued by the authorization server.
   * REQUIRED.
   */
  readonly access_token: string;
  /**
   * The type of the token issued.  Value is case insensitive.
   * REQUIRED.
   */
  readonly token_type: string;
  /**
   * The lifetime in seconds of the access token.
   * RECOMMENDED.
   */
  readonly expires_in: number;
  /**
   * The refresh token, which can be used to obtain new access tokens
   * using the same authorization grant.
   * OPTIONAL.
   */
  readonly refresh_token?: string;
  /**
   * The scope of the access token.
   * OPTIONAL, if identical to the scope requested by the client;
   * otherwise, REQUIRED.
   */
  readonly scope?: string;
};

/**
 * @see https://www.rfc-editor.org/rfc/rfc6749#section-5.2
 *
 * The authorization server responds with an HTTP 400 (Bad Request)
 * status code (unless specified otherwise).
 * The parameters are included in the entity-body of the HTTP response
 * using the `"application/json"` media type
 */
export type ErrorResponse = {
  /**
   * A single error code.
   * REQUIRED.
   */
  readonly error: ErrorCode;
  /**
   * Human-readable text providing additional information,
   * used to assist the client developer in understanding
   * the error that occurred.
   * OPTIONAL.
   */
  readonly error_description?: string;
  /**
   * A URI identifying a human-readable web page with information
   * about the error, used to provide the client developer
   * with additional information about the error.
   * OPTIONAL.
   */
  readonly error_uri?: string;
};

/**
 * @see https://www.rfc-editor.org/rfc/rfc6749#section-5.2
 *
 * # invalid_request
 *
 * The request is missing a required parameter, includes an
 * unsupported parameter value (other than grant type),
 * repeats a parameter, includes multiple credentials,
 * utilizes more than one mechanism for authenticating the
 * client, or is otherwise malformed.
 *
 * # invalid_client
 *
 * Client authentication failed (e.g., unknown client, no
 * client authentication included, or unsupported
 * authentication method).  The authorization server MAY
 * return an HTTP 401 (Unauthorized) status code to indicate
 * which HTTP authentication schemes are supported.  If the
 * client attempted to authenticate via the "Authorization"
 * request header field, the authorization server MUST
 * respond with an HTTP 401 (Unauthorized) status code and
 * include the "WWW-Authenticate" response header field
 * matching the authentication scheme used by the client.
 *
 * # invalid_grant
 *
 * The provided authorization grant (e.g., authorization
 * code, resource owner credentials) or refresh token is
 * invalid, expired, revoked, does not match the redirection
 * URI used in the authorization request, or was issued to
 * another client.
 *
 * # unauthorized_client
 *
 * The authenticated client is not authorized to use this
 * authorization grant type.
 *
 * # unsupported_grant_type
 *
 * The authorization grant type is not supported by the
 * authorization server.
 *
 * # invalid_scope
 *
 * The requested scope is invalid, unknown, malformed, or
 * exceeds the scope granted by the resource owner.
 */
export type ErrorCode =
  | "invalid_request"
  | "invalid_client"
  | "invalid_grant"
  | "invalid_scope"
  | "unauthorized_client"
  | "unsupported_grant_type";
