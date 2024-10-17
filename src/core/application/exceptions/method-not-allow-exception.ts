import {
  ExceptionFilter,
  Catch,
  HttpException,
  ArgumentsHost,
  HttpStatus,
} from '@nestjs/common';
import { Response, Request } from 'express';
import { apiExceptionConfig } from 'src/utils/api/apiExceptionConfig';
import { ValidationError } from 'class-validator';
import { apiMethods, apiMethodsName } from 'src/utils/api/apiMethodsName';
import { LoggerService } from '../loggger/logger.service';

@Catch(HttpException)
export class MethodNotAllowedFilter implements ExceptionFilter {
  constructor(private readonly logger: LoggerService) {}

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const httpMethod = request.method;
    const status = exception.getStatus();
    const validationErrors = this.extractValidationErrors(exception);
    // Obtener configuración de la ruta
    const routeConfig = this.getRouteConfig(httpMethod, request.url);
    console.log(routeConfig);
    const entity = routeConfig?.entity ?? this.getEntityFromMethod(httpMethod);
    console.log(entity);
    // Si no hay configuración de ruta, verifica si el método es permitido
    if (!routeConfig) {
      return this.handleMethodNotAllowed(response, entity);
    }

    const errorLogs = this.createErrorLog(
      exception,
      status,
      httpMethod,
      entity,
      validationErrors,
    );

    // Log de error
    this.logger.error(JSON.stringify(errorLogs));

    // Responder al cliente con la estructura nueva
    response.status(status).json(errorLogs);
  }

  private handleMethodNotAllowed(response: Response, entity: string) {
    const errorResponse = {
      code: HttpStatus.METHOD_NOT_ALLOWED,
      message: apiExceptionConfig.methodNotAllowed.message,
      timestamp: new Date().toISOString(),
      service: entity,
    };

    response.status(HttpStatus.METHOD_NOT_ALLOWED).json(errorResponse);
  }

  private extractValidationErrors(exception: HttpException) {
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

  private getRouteConfig(httpMethod: string, url: string) {
    return apiExceptionConfig.methodNotAllowed.routes.find((route) => {
      console.log(route);
      return route.method === httpMethod && url.startsWith(route.path);
    });
  }

  private getEntityFromMethod(httpMethod: string) {
    return apiMethodsName[
      httpMethod.toLowerCase() as keyof typeof apiMethodsName
    ];
  }

  private createErrorLog(
    exception: HttpException,
    status: number,
    httpMethod: string,
    entity: string,
    groupedErrors: Record<string, string[]>,
  ) {
    const customMessage =
      exception.message || apiExceptionConfig.methodNotAllowed.message;
    console.log(groupedErrors);
    if (groupedErrors) {
      return {
        code: status === 405 || status === 409 ? status : status,
        message: customMessage,
        timestamp: new Date().toISOString(),
        service: apiMethods(httpMethod, entity),
        errors: groupedErrors, // Incluir errores agrupados en el log
      };
    }

    return {
      code: status === 405 || status === 409 ? status : status,
      message: customMessage,
      timestamp: new Date().toISOString(),
      service: apiMethods(httpMethod, entity),
    };
  }
}
