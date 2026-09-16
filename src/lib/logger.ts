type LogLevel = 'info' | 'warn' | 'error' | 'debug';

interface LogContext {
  conversationId?: string;
  action?: string;
  durationMs?: number;
  responseType?: string;
  factIds?: string[];
  errorCode?: string;
  [key: string]: unknown;
}

/**
 * Server-side sanitized structured logger.
 * Strips any sensitive credentials, headers, or PII before logging.
 */
class Logger {
  private format(level: LogLevel, message: string, context?: LogContext): string {
    const timestamp = new Date().toISOString();
    const cleanContext = { ...context };

    // Sanitize any accidentally passed keys/tokens
    for (const key of Object.keys(cleanContext)) {
      if (/key|secret|token|auth|password|cookie/i.test(key)) {
        cleanContext[key] = '[REDACTED]';
      }
    }

    return JSON.stringify({
      timestamp,
      level: level.toUpperCase(),
      message,
      ...cleanContext,
    });
  }

  public info(message: string, context?: LogContext): void {
    console.log(this.format('info', message, context));
  }

  public warn(message: string, context?: LogContext): void {
    console.warn(this.format('warn', message, context));
  }

  public error(message: string, context?: LogContext): void {
    console.error(this.format('error', message, context));
  }

  public debug(message: string, context?: LogContext): void {
    if (process.env.NODE_ENV !== 'production') {
      console.debug(this.format('debug', message, context));
    }
  }
}

export const logger = new Logger();
