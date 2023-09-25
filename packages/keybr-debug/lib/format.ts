export function format(error: any): string {
  const lines = [];
  lines.push(messageOf(error));
  if (process.env.NODE_ENV !== "test") {
    const stack = stackOf(error);
    if (typeof stack === "string" && stack !== "") {
      lines.push(stack);
    }
  }
  if (error != null) {
    error = causeOf(error);
    while (error != null) {
      lines.push("Because: " + messageOf(error));
      if (process.env.NODE_ENV !== "test") {
        const stack = stackOf(error);
        if (typeof stack === "string" && stack !== "") {
          lines.push(stack);
        }
      }
      error = causeOf(error);
    }
  }
  return lines.join("\n");
}

function messageOf(error: any): string {
  switch (error) {
    case undefined:
      return "<undefined>";
    case null:
      return "<null>";
    case "":
      return "<empty>";
  }
  if (typeof error === "object") {
    const { name = "Unknown", message = null, code = null } = error;
    const type = Object.prototype.toString.call(error);
    let report = String(name);
    if (message != null && message !== "") {
      report = `${report}: ${String(message)}`;
    }
    if (code != null && code !== "") {
      report = `${report} (code=${String(code)})`;
    }
    if (type !== "[object Error]") {
      report = `${report} (type=${type})`;
    }
    return report;
  }
  return String(error);
}

function causeOf(error: any): any {
  if (error != null && typeof error === "object") {
    return error.cause ?? null;
  } else {
    return null;
  }
}

function stackOf(error: any): any {
  if (error != null && typeof error === "object") {
    return error.stack ?? null;
  } else {
    return null;
  }
}
