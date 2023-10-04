export type Report = readonly ReportItem[];
export type ReportItem = {
  readonly message: string;
  readonly stack: string | null;
};

export function formatReport(
  report: Report,
  withStack: boolean = process.env.NODE_ENV !== "test",
): string {
  const lines = [];
  for (const item of report) {
    if (lines.length > 0) {
      lines.push("");
      lines.push(`Cause: ${item.message}`);
    } else {
      lines.push(`${item.message}`);
    }
    if (item.stack && withStack) {
      lines.push(`${item.stack}`);
    }
  }
  return lines.join("\n");
}

export function inspectError(error: any): Report {
  const items = [];
  items.push({ message: formatMessage(error), stack: getStack(error) });
  error = getCause(error);
  while (error != null) {
    items.push({ message: formatMessage(error), stack: getStack(error) });
    error = getCause(error);
  }
  return items;
}

function formatMessage(error: any): string {
  const type = Object.prototype.toString.call(error);
  switch (error) {
    case undefined:
      return type;
    case null:
      return type;
  }
  if (typeof error === "object") {
    const name = getName(error) || "Unknown";
    const message = getMessage(error);
    const code = getCode(error);
    let report = name;
    if (message != null) {
      report = `${report}: ${String(message)}`;
    }
    if (code != null) {
      report = `${report} (code=${String(code)})`;
    }
    if (type !== "[object Error]") {
      report = `${report} (type=${type})`;
    }
    return report;
  }
  return `${String(error)} (type=${type})`;
}

function getName(error: any): string | null {
  if (hasProp(error, "name")) {
    const { name } = error;
    if (typeof name === "string") {
      return name || null;
    }
  }
  return null;
}

function getMessage(error: any): string | null {
  if (hasProp(error, "message")) {
    const { message } = error;
    if (typeof message === "string") {
      return message || null;
    }
  }
  return null;
}

function getCode(error: any): string | number | null {
  if (hasProp(error, "code")) {
    const { code } = error;
    if (typeof code === "string") {
      return code || null;
    }
    if (typeof code === "number") {
      return code;
    }
  }
  return null;
}

function getStack(error: any): string | null {
  if (hasProp(error, "stack")) {
    const { stack } = error;
    if (typeof stack === "string") {
      return stack || null;
    }
  }
  return null;
}

function getCause(error: any): any {
  if (hasProp(error, "cause")) {
    return error.cause ?? null;
  }
  return null;
}

function hasProp(error: any, prop: string): boolean {
  return error != null && typeof error === "object" && prop in error;
}
