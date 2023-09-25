/*
 * These constants are filled in at build time by the bundler
 * with the values taken from an `env` file.
 */

export const googleTagManagerId = process.env.GOOGLE_TAG_MANAGER_ID || "0";
export const cloudflareAnalyticsId = process.env.CLOUDFLARE_ANALYTICS_ID || "0";
export const cookiebotClientId = process.env.COOKIEBOT_CLIENT_ID || "0";
export const paddleVendorId = Number(process.env.PADDLE_VENDOR_ID || "0");
export const paddleProductId = Number(process.env.PADDLE_PRODUCT_ID || "0");
