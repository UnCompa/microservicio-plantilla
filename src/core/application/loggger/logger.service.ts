import { Injectable, Scope } from '@nestjs/common';
import { Logger, createLogger, format, transports } from 'winston';
import 'winston-daily-rotate-file';

@Injectable({ scope: Scope.TRANSIENT })
export class LoggerService {
  private readonly logger: Logger;
  private readonly levelLogger: string;

  constructor() {
    this.levelLogger = process.env.LOG_LEVEL ?? 'debug'; // Establece el nivel del log desde el entorno.
    this.logger = this.createLogger();
  }

  private createLogger(): Logger {
    const syslogColors = {
      debug: 'rainbow',
      info: 'green',
      notice: 'white',
      warning: 'yellow',
      error: 'red',
      crit: 'inverse yellow',
      alert: 'bold inverse red',
      emerg: 'bold inverse magenta',
    };

    const logFormat = format.combine(
      format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
      format.printf((info) =>
        typeof info.message === 'string'
          ? `${info.timestamp} - [${info.level.toUpperCase()}] ${info.context || 'APP'}: ${info.message}`
          : `${info.timestamp} - [${info.level.toUpperCase()}] ${info.context || 'APP'}: ${JSON.stringify(info.message)}`,
      ),
    );

    return createLogger({
      level: this.levelLogger,
      transports: [
        // Transporte para logs de nivel "info"
        new transports.DailyRotateFile({
          filename: 'logs/info/info-%DATE%.log',
          datePattern: 'YYYY-MM-DD',
          level: 'info', // Solo captura logs de nivel "info"
          maxSize: '20m',
          maxFiles: '14d',
        }),
        // Transporte para logs de nivel "error"
        new transports.DailyRotateFile({
          filename: 'logs/error/error-%DATE%.log',
          datePattern: 'YYYY-MM-DD',
          level: 'error', // Solo captura logs de nivel "error"
          maxSize: '20m',
          maxFiles: '14d',
        }),
        // Transporte para logs de nivel "debug"
        new transports.DailyRotateFile({
          filename: 'logs/debug/debug-%DATE%.log',
          datePattern: 'YYYY-MM-DD',
          level: 'debug', // Solo captura logs de nivel "debug"
          maxSize: '20m',
          maxFiles: '14d',
        }),
        // Transporte para todos los logs en una carpeta "all"
        new transports.DailyRotateFile({
          filename: 'logs/all/all-%DATE%.log',
          datePattern: 'YYYY-MM-DD',
          maxSize: '20m',
          maxFiles: '14d',
        }),
        // Transporte para imprimir en consola
        new transports.Console({
          format: format.combine(
            logFormat,
            format.colorize({ all: true, colors: syslogColors }),
          ),
        }),
      ],
    });
  }

  private isLevelEnabled(level: string): boolean {
    const levels = ['debug', 'info', 'warn', 'error'];
    const currentIndex = levels.indexOf(this.levelLogger);
    const targetIndex = levels.indexOf(level);
    return targetIndex >= currentIndex;
  }

  private formatMessage(message: string | object): string {
    return typeof message === 'object' ? JSON.stringify(message) : message;
  }

  log(message: string | object, context?: string): void {
    if (this.isLevelEnabled('info')) {
      this.logger.info(this.formatMessage(message), { context });
    }
  }

  error(message: string | object, trace?: string, context?: string): void {
    if (this.isLevelEnabled('error')) {
      this.logger.error(this.formatMessage(message), { context, trace });
    }
  }

  warn(message: string | object, context?: string): void {
    if (this.isLevelEnabled('warn')) {
      this.logger.warn(this.formatMessage(message), { context });
    }
  }

  debug(message: string | object, context?: string): void {
    if (this.isLevelEnabled('debug')) {
      this.logger.debug(this.formatMessage(message), { context });
    }
  }

  verbose(message: string | object, context?: string): void {
    if (this.isLevelEnabled('debug')) {
      this.logger.verbose(this.formatMessage(message), { context });
    }
  }
}
