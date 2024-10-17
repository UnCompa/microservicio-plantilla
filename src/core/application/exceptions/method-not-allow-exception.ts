import {
  ExceptionFilter,
  Catch,
  HttpException,
  ArgumentsHost,
  HttpStatus,
  BadRequestException,
} from '@nestjs/common';
import { Response, Request } from 'express';
import { match } from 'path-to-regexp';
import { enablePathMethods } from 'src/utils/api/apiEnableMethods';
import { LoggerService } from '../loggger/logger.service';
import { ValidationError } from 'class-validator';

@Catch(HttpException)
export class MethodNotAllowedFilter implements ExceptionFilter {
  constructor(private readonly logger: LoggerService) {}

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const httpMethod = request.method.toLowerCase(); // Obtener el método HTTP
    const status = exception.getStatus();
    const path = request.originalUrl; // Obtener el path solicitado
    let customMessage =
      exception.message ||
      `An error occurred with the ${httpMethod.toUpperCase()} method for path: ${path}`;
    if (request.body == undefined) {
      customMessage = 'Structure error';
    }
    if (Object.keys(request.body).length === 0) {
      customMessage = 'Structure error';
    }
    // Verificar si la ruta está definida en enablePathMethods para el método actual
    const isMethodAllowed = this.isMethodAllowed(httpMethod, path);
    const validationErrors = this.extractValidationErrors(exception);
    if (!isMethodAllowed) {
      // Verificar si la ruta existe para cualquier método
      const isRouteDefined = this.isRouteDefined(path);

      if (!isRouteDefined) {
        // Si la ruta no está definida en ningún método, devolver un 404
        return this.handleNotFound(response, path);
      }

      // Si la ruta existe pero el método no está permitido, devolver un 405
      return this.handleMethodNotAllowed(response, path);
    }

    // Si ocurre cualquier otra excepción, manejarla y enviar la respuesta
    const errorLogs = this.createErrorLog(
      exception,
      status,
      httpMethod,
      path,
      customMessage,
      validationErrors,
    );
    this.logger.error(JSON.stringify(errorLogs));
    return response.status(status).json(errorLogs);
  }

  // Verificar si la ruta está definida para el método HTTP actual
  private isMethodAllowed(httpMethod: string, path: string): boolean {
    if (enablePathMethods[httpMethod]) {
      return enablePathMethods[httpMethod].some((allowedPath) => {
        const matcher = match(allowedPath, { decode: decodeURIComponent });
        return matcher(path);
      });
    }
    return false;
  }

  // Verificar si la ruta está definida en cualquier método
  private isRouteDefined(path: string): boolean {
    return Object.values(enablePathMethods).some((allowedPaths) =>
      allowedPaths.some((allowedPath) => {
        const matcher = match(allowedPath, { decode: decodeURIComponent });
        return matcher(path);
      }),
    );
  }

  // Manejar la respuesta para rutas no encontradas (404)
  private handleNotFound(response: Response, path: string) {
    const errorResponse = {
      code: HttpStatus.NOT_FOUND,
      message: `Route ${path} not found`,
      timestamp: new Date().toISOString(),
    };
    this.logger.error(JSON.stringify(errorResponse));
    response.status(HttpStatus.NOT_FOUND).json(errorResponse);
  }

  // Manejar la respuesta para métodos no permitidos (405)
  private handleMethodNotAllowed(response: Response, path: string) {
    const errorResponse = {
      code: HttpStatus.METHOD_NOT_ALLOWED,
      message: `Method not allowed for path: ${path}`,
      timestamp: new Date().toISOString(),
    };
    this.logger.error(JSON.stringify(errorResponse));
    response.status(HttpStatus.METHOD_NOT_ALLOWED).json(errorResponse);
  }

  // Crear log de error para respuestas personalizadas
  private createErrorLog(
    exception: HttpException,
    status: number,
    httpMethod: string,
    path: string,
    message: string,
    groupedErrors: Record<string, string[]>,
  ) {
    let errors;
    if (groupedErrors) {
      errors = {
        code: status,
        message: message,
        timestamp: new Date().toISOString(),
        path,
        method: httpMethod.toUpperCase(),
        groupedErrors: groupedErrors,
      };
    } else {
      errors = {
        code: status,
        message: message,
        timestamp: new Date().toISOString(),
        path,
        method: httpMethod.toUpperCase(),
      };
    }
    return errors;
  }
  private extractValidationErrors(exception: BadRequestException) {
    const exceptionResponse: any = exception.getResponse();
    const validationErrors = exceptionResponse.message;
    let groupedErrors: Record<string, string[]> = {};

    if (Array.isArray(validationErrors)) {
      groupedErrors = validationErrors.reduce(
        (acc: Record<string, string[]>, error: ValidationError | string) => {
          if (typeof error === 'string') {
            acc.general = acc.general || [];
            acc.general.push(error);
          } else {
            const field = error.property;
            const messages = Object.values(error.constraints);
            acc[field] = acc[field] || [];
            acc[field].push(...messages);
          }
          return acc;
        },
        {},
      );
    } else if (typeof validationErrors === 'string') {
      groupedErrors.general = [validationErrors];
    }

    return groupedErrors;
  }
}
