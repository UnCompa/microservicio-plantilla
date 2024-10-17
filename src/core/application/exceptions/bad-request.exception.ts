import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  BadRequestException,
} from '@nestjs/common';
import { ValidationError } from 'class-validator';
import { Response, Request } from 'express';
import { LoggerService } from '../loggger/logger.service';
import { apiExceptionConfig } from 'src/utils/api/apiExceptionConfig'; // Asegúrate de que la ruta sea correcta
import { apiMethodsName } from 'src/utils/api/apiMethodsName'; //';

@Catch(BadRequestException)
export class BadRequestExceptionFilter implements ExceptionFilter {
  constructor(private logger: LoggerService) {}

  catch(exception: BadRequestException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const exceptionResponse: any = exception.getResponse();
    const validationErrors = exceptionResponse.message;

    let groupedErrors: Record<string, string[]> = {};

    // Agrupar errores de validación
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

    // Obtener el método HTTP
    const request = ctx.getRequest<Request>();
    const httpMethod = request.method;
    const serviceName =
      apiMethodsName[httpMethod.toLowerCase() as keyof typeof apiMethodsName]; // Obtener el nombre del servicio

    // Registro del error utilizando el servicio de logger
    const errorLogs = JSON.stringify({
      code: apiExceptionConfig.badRequest.code,
      message: apiExceptionConfig.badRequest.message,
      timestamp: new Date().toISOString(),
      service: serviceName,
      errors: groupedErrors, // Incluyendo errores agrupados en el log
    });
    this.logger.error(errorLogs);

    // Responder al cliente siguiendo la nueva estructura
    response.status(status).json({
      code: apiExceptionConfig.badRequest.code, // Tipo de error configurable
      message: apiExceptionConfig.badRequest.message, // Mensaje configurable
      timestamp: new Date().toISOString(), // Timestamp actual
      service: serviceName, // Incluir el nombre del servicio
      errors: groupedErrors, // Incluyendo errores agrupados en el log
    });
  }
}
