"use strict";

const { join } = require("node:path");
const { config } = require("dotenv");

config({ path: join(__dirname, "lib", "config-env") });
config({ path: join(__dirname, "lib", "config-env.example") });

for (const key of [
  "GOOGLE_TAG_MANAGER_ID",
  "CLOUDFLARE_ANALYTICS_ID",
  "COOKIEBOT_CLIENT_ID",
  "PADDLE_VENDOR_ID",
  "PADDLE_PRODUCT_ID",
]) {
  module.exports[`process.env.${key}`] = JSON.stringify(process.env[key]);
}
