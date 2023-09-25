export function fixTimestamps(result: any): any {
  if (Array.isArray(result)) {
    for (const item of result) {
      if (item != null && typeof item === "object") {
        for (const key of ["created_at", "updated_at", "expires_at"]) {
          if (key in item && typeof item[key] === "number") {
            item[key] = new Date(item[key]);
          }
        }
      }
    }
  }
  return result;
}
