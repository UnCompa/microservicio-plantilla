import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  BadRequestException,
} from '@nestjs/common';
import { ValidationError } from 'class-validator';
import { Response, Request } from 'express';
import { apiExceptionConfig } from 'src/utils/api/apiExceptionConfig';
import { apiMethodsName, apiMethods } from 'src/utils/api/apiMethodsName';
import { LoggerService } from '../loggger/logger.service';
@Catch(BadRequestException)
export class BadRequestExceptionFilter implements ExceptionFilter {
  private readonly INVALID_JSON_MESSAGE = 'Invalid JSON structure';

  constructor(private logger: LoggerService) {}

  catch(exception: BadRequestException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    const httpMethod = request.method;
    // Verificar si es un error de JSON mal formado
    const isJsonError = this.isJsonSyntaxError(exception);

    // Manejo de los errores
    if (isJsonError) {
      this.handleJsonError(exception, response, status, request);
    } else {
      this.handleValidationError(
        exception,
        response,
        status,
        request,
        httpMethod,
      );
    }
  }

  private isJsonSyntaxError(exception: BadRequestException): boolean {
    const exceptionResponse: string | object = exception.getResponse();
    return (
      typeof exceptionResponse === 'string' &&
      (exceptionResponse.includes('Unexpected token') ||
        exceptionResponse.includes('Bad control character'))
    );
  }

  private handleJsonError(
    exception: BadRequestException,
    response: Response,
    status: number,
    request: Request,
  ) {
    const jsonErrorResponse = this.createJsonErrorResponse(
      exception,
      status,
      request,
    );
    this.logger.error('Invalid JSON' + JSON.stringify(jsonErrorResponse));
    response.status(status).json(jsonErrorResponse);
  }

  private handleValidationError(
    exception: BadRequestException,
    response: Response,
    status: number,
    request: Request,
    httpMethod: string,
  ) {
    const validationErrors = this.extractValidationErrors(exception);
    const routeConfig = this.getRouteConfig(httpMethod, request.originalUrl);
    const entity = routeConfig.entity || this.getEntityFromMethod(httpMethod);
    const errorLogs = this.createErrorLog(
      exception,
      status,
      httpMethod,
      entity,
      validationErrors,
    );
    this.logger.error('Validation Error' + JSON.stringify(errorLogs));
    response.status(status).json(errorLogs);
  }

  private createJsonErrorResponse(
    exception: BadRequestException,
    status: number,
    request: Request,
  ) {
    return {
      code: status,
      message: this.INVALID_JSON_MESSAGE,
      detailedMessage:
        'There was an issue with the JSON format. Ensure that all property names are double-quoted and check for any illegal control characters.',
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
    };
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
        {} as Record<string, string[]>,
      );
    } else if (typeof validationErrors === 'string') {
      groupedErrors.general = [validationErrors];
    }

    return groupedErrors;
  }

  private getRouteConfig(httpMethod: string, url: string) {
    const defaultRouteConfig = {
      entity: this.getEntityFromMethod(httpMethod), // Usar getEntityFromMethod como valor por defecto
      method: httpMethod,
      path: url,
    };
    const cleanPath = (path: string) => path.replace(/\.$/, '');
    const configRoute = apiExceptionConfig.notFound.routes.find(route => {
      const cleanedRoutePath = cleanPath(route.path);
      const cleanedUrl = cleanPath(url);
      return (
        route.method === httpMethod && cleanedRoutePath.startsWith(cleanedUrl)
      );
    });
    return configRoute || defaultRouteConfig;
  }

  private getEntityFromMethod(httpMethod: string) {
    return apiMethodsName[
      httpMethod.toLowerCase() as keyof typeof apiMethodsName
    ];
  }

  private createErrorLog(
    exception: BadRequestException,
    status: number,
    httpMethod: string,
    entity: string,
    groupedErrors: Record<string, string[]>,
  ) {
    return {
      code: apiExceptionConfig.badRequest.code,
      message:
        this.INVALID_JSON_MESSAGE || apiExceptionConfig.badRequest.message,
      timestamp: new Date().toISOString(),
      service: apiMethods(httpMethod, entity),
      errors: groupedErrors,
    };
  }
}
