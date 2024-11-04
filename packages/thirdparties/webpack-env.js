import { join } from "node:path";
import { config } from "dotenv";

config({ path: join(import.meta.dirname, "lib", "config-env") });
config({ path: join(import.meta.dirname, "lib", "config-env.example") });

const ENV = {};

for (const key of [
  "GOOGLE_TAG_MANAGER_ID",
  "CLOUDFLARE_ANALYTICS_ID",
  "COOKIEBOT_CLIENT_ID",
  "PADDLE_TOKEN",
  "PADDLE_PRICE_ID",
]) {
  ENV[`process.env.${key}`] = JSON.stringify(process.env[key]);
}

export { ENV };
