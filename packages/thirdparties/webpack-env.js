import { join } from "node:path";

for (const path of [
  // First definition wins, so list the paths in the reversed order.
  join(import.meta.dirname, "lib", "config-env"),
  join(import.meta.dirname, "lib", "config-env.example"),
]) {
  try {
    process.loadEnvFile(path);
  } catch (err) {
    if (err.code !== "ENOENT") {
      throw err;
    }
  }
}

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
