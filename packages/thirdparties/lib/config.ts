/*
 * The bundler fills in these constants at build time
 * with the values taken from an `env` file.
 */

export const googleTagManagerId = process.env.GOOGLE_TAG_MANAGER_ID || "0";
export const cloudflareAnalyticsId = process.env.CLOUDFLARE_ANALYTICS_ID || "0";
export const cookiebotClientId = process.env.COOKIEBOT_CLIENT_ID || "0";
export const paddleToken = process.env.PADDLE_TOKEN || "0";
export const paddlePriceId = process.env.PADDLE_PRICE_ID || "0";
