type LogLevel = "info" | "warn" | "error" | "debug";

const PREFIX = "[OpenWA Service]";

export const logger = {
  info: (message: string, ...args: unknown[]) => {
    console.log(`${PREFIX} [INFO] ${new Date().toISOString()} - ${message}`, ...args);
  },
  warn: (message: string, ...args: unknown[]) => {
    console.warn(`${PREFIX} [WARN] ${new Date().toISOString()} - ${message}`, ...args);
  },
  error: (message: string, ...args: unknown[]) => {
    console.error(`${PREFIX} [ERROR] ${new Date().toISOString()} - ${message}`, ...args);
  },
  debug: (message: string, ...args: unknown[]) => {
    if (process.env.NODE_ENV !== "production") {
      console.log(`${PREFIX} [DEBUG] ${new Date().toISOString()} - ${message}`, ...args);
    }
  },
};
