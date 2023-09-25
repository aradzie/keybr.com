import { randomBytes } from "node:crypto";
import { resolve } from "node:path";

function getDataDir() {
  return resolve(`/tmp/keybr-tests-${randomBytes(6).toString("hex")}`);
}

function getPublicDir() {
  return resolve(__dirname, "..", "..", "..", "root", "public");
}

process.env.DATA_DIR ??= getDataDir();
process.env.PUBLIC_DIR ??= getPublicDir();

process.env.DATABASE_CLIENT ??= "mysql";
process.env.DATABASE_HOST ??= "127.0.0.1";
process.env.DATABASE_PORT ??= "3306";
process.env.DATABASE_DATABASE ??= "keybr_tests";
process.env.DATABASE_USERNAME ??= "keybr";
process.env.DATABASE_PASSWORD ??= "";
process.env.DATABASE_FILENAME ??= ":memory:";

process.env.COOKIE_DOMAIN = "";
process.env.COOKIE_PATH = "/";
process.env.COOKIE_SECURE = "false";

process.env.AUTH_GOOGLE_CLIENT_ID = "id";
process.env.AUTH_GOOGLE_CLIENT_SECRET = "secret";

process.env.AUTH_FACEBOOK_CLIENT_ID = "id";
process.env.AUTH_FACEBOOK_CLIENT_SECRET = "secret";

process.env.PADDLE_VENDOR_ID = "123123";
process.env.PADDLE_VENDOR_AUTH_CODE = "vendorAuthCode";
process.env.PADDLE_PRODUCT_ID = "321321";
process.env.PADDLE_PRIVATE_KEY = `-----BEGIN PRIVATE KEY-----
MIIBVgIBADANBgkqhkiG9w0BAQEFAASCAUAwggE8AgEAAkEApMofxX9wFMEs9Oua
ab07zTYYs2xnK5iLybi+iHHZXSQb2JFyce1SLMN65hgveusPcT36R3f2haVlIZ8H
7KH7XwIDAQABAkEAob6arLlHA7gQLl3KdBr/RY7hc8rlAQ97tYWVzksg9J9Tak50
6Ru3u/+5KKxrj0RYZ/1pZEP/FVBEpdu5woKjkQIhAOwr2wrVAfbm0iji4cS+IOEI
q+onoLZQqOy8DeuAO2orAiEAsqAGkUpYcAI71QofgDB/LDPO3BpHk8artLJ0JekB
HZ0CIQDNOhbwRMWePlpl+TJjeyyrIJPzuFfp1hHVFl2qRhZbXQIgH9ONeAO0IDj1
qi7EkBWUAy8z81mnWTgzzd1h/oM2lK0CIQCRYVGypNFMK+eiCB3LL0VoCevXF4Rz
oli9WUFEA6amlQ==
-----END PRIVATE KEY-----`;
process.env.PADDLE_PUBLIC_KEY = `-----BEGIN PUBLIC KEY-----
MFwwDQYJKoZIhvcNAQEBBQADSwAwSAJBAKTKH8V/cBTBLPTrmmm9O802GLNsZyuY
i8m4vohx2V0kG9iRcnHtUizDeuYYL3rrD3E9+kd39oWlZSGfB+yh+18CAwEAAQ==
-----END PUBLIC KEY-----`;
