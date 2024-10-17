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
  constructor(private readonly logger: LoggerService) {}

  catch(exception: BadRequestException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    const httpMethod = request.method;
    // Verificar si es un error de JSON mal formado
    const isJsonError = this.isJsonSyntaxError(exception);

    // Si es un error de JSON mal formado
    if (isJsonError) {
      const jsonErrorResponse = this.createJsonErrorResponse(
        exception,
        status,
        request,
      );
      // Log de error para JSON inválido
      this.logger.error(JSON.stringify(jsonErrorResponse));

      // Responder con el error de JSON inválido
      return response.status(status).json(jsonErrorResponse);
    }

    // Extraer errores de validación
    const validationErrors = this.extractValidationErrors(exception);

    // Obtener la configuración de la ruta o usar la entidad predeterminada
    const routeConfig = this.getRouteConfig(httpMethod, request.url);
    const entity = routeConfig.entity || this.getEntityFromMethod(httpMethod);

    // Crear los logs de error
    const errorLogs = this.createErrorLog(
      exception,
      status,
      httpMethod,
      entity,
      validationErrors,
    );

    // Log de error para validaciones
    this.logger.error(JSON.stringify(errorLogs));

    // Responder al cliente con la estructura nueva
    response.status(status).json(errorLogs);
  }

  // Verificar si el error es causado por JSON inválido
  private isJsonSyntaxError(exception: BadRequestException) {
    const exceptionResponse: any = exception.getResponse();
    return (
      typeof exceptionResponse === 'string' &&
      exceptionResponse.includes('Unexpected token')
    );
  }

  // Crear una respuesta para errores de JSON mal formado
  private createJsonErrorResponse(
    exception: BadRequestException,
    status: number,
    request: Request,
  ) {
    return {
      code: status,
      message: 'Invalid JSON structure',
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
    };
  }

  // Extraer y agrupar los errores de validación
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

  // Obtener la configuración de la ruta con una opción por defecto si no se encuentra coincidencia
  private getRouteConfig(httpMethod: string, url: string) {
    const defaultRouteConfig = {
      entity: this.getEntityFromMethod(httpMethod), // Usar getEntityFromMethod como valor por defecto
      method: httpMethod, // Usa el método HTTP actual
      path: url, // Ruta genérica
    };

    return (
      apiExceptionConfig.badRequest.routes.find(
        (route) => route.method === httpMethod && url.startsWith(route.path),
      ) || defaultRouteConfig
    );
  }

  // Obtener la entidad basada en el método HTTP
  private getEntityFromMethod(httpMethod: string) {
    return apiMethodsName[
      httpMethod.toLowerCase() as keyof typeof apiMethodsName
    ];
  }

  // Crear los logs de error
  private createErrorLog(
    exception: BadRequestException,
    status: number,
    httpMethod: string,
    entity: string,
    groupedErrors: Record<string, string[]>,
  ) {
    return {
      code: apiExceptionConfig.badRequest.code,
      message: apiExceptionConfig.badRequest.message,
      timestamp: new Date().toISOString(),
      service: apiMethods(httpMethod, entity),
      errors: groupedErrors, // Incluir errores agrupados en el log
    };
  }
}
