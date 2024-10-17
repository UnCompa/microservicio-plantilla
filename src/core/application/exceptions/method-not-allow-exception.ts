import {
  ExceptionFilter,
  Catch,
  HttpException,
  ArgumentsHost,
  HttpStatus,
} from '@nestjs/common';
import { Response, Request } from 'express';
import { match } from 'path-to-regexp';
import { enablePathMethods } from 'src/utils/api/apiEnableMethods';
import { LoggerService } from '../loggger/logger.service';

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
    console.log(request.body);
    if (request.body) {
      customMessage = 'Structure error';
    }
    console.log(Object.keys(request.body).length);
    if (Object.keys(request.body).length === 0) {
      customMessage = 'Structure error';
    }
    // Verificar si la ruta está definida en enablePathMethods para el método actual
    const isMethodAllowed = this.isMethodAllowed(httpMethod, path);

    if (!isMethodAllowed) {
      // Verificar si la ruta existe para cualquier método
      const isRouteDefined = this.isRouteDefined(path);

      if (!isRouteDefined) {
        console.log(path);

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
    response.status(HttpStatus.NOT_FOUND).json(errorResponse);
  }

  // Manejar la respuesta para métodos no permitidos (405)
  private handleMethodNotAllowed(response: Response, path: string) {
    const errorResponse = {
      code: HttpStatus.METHOD_NOT_ALLOWED,
      message: `Method not allowed for path: ${path}`,
      timestamp: new Date().toISOString(),
    };
    response.status(HttpStatus.METHOD_NOT_ALLOWED).json(errorResponse);
  }

  // Crear log de error para respuestas personalizadas
  private createErrorLog(
    exception: HttpException,
    status: number,
    httpMethod: string,
    path: string,
    message: string,
  ) {
    return {
      code: status,
      message: message,
      timestamp: new Date().toISOString(),
      path,
      method: httpMethod.toUpperCase(),
    };
  }
}
