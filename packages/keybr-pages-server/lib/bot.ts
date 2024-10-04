import { type IncomingHeaders } from "@fastr/headers";

export function isBot(headers: IncomingHeaders): boolean {
  return (headers.get("UserAgent") ?? "").toLowerCase().includes("googlebot");
}
