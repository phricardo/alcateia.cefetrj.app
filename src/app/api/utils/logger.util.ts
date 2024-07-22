export default class Logger {
  info(...args: any[]) {
    console.log("[INFO]", ...args);
  }

  warning(...args: any[]) {
    console.warn("[WARNING]", ...args);
  }

  error(message: string, error?: unknown) {
    if (error instanceof Error) {
      console.error("[ERROR]", message, error.message);
    } else if (typeof error === "string") {
      console.error("[ERROR]", message, error);
    } else {
      console.error("[ERROR]", message);
    }
  }
}
