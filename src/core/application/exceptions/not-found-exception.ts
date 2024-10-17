import {
  ExceptionFilter,
  Catch,
  NotFoundException,
  ArgumentsHost,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { LoggerService } from '../loggger/logger.service'; // Asegúrate de que la ruta sea correcta
import { apiExceptionConfig } from 'src/utils/api/apiExceptionConfig';
import { Validator } from 'src/utils/api/apiValidations';
import { apiBaseEntityName } from 'src/utils/api/apiBaseEntities';
import { apiMethodsName } from 'src/utils/api/apiMethodsName';

@Catch(NotFoundException) // Este decorador indica que este filtro manejará excepciones de tipo NotFoundException
export class NotFoundExceptionFilter implements ExceptionFilter {
  constructor(private logger: LoggerService) {} // Inyección del servicio de logger

  catch(exception: NotFoundException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    const exceptionResponse: any = exception.getResponse();
    const httpMethod = request.method; // Obtener el método HTTP
    let customMessage = exceptionResponse.message;

    if (exception.message.includes('Cannot')) {
      customMessage = `The route '${request.url}' was not found. Please ensure that the URL is correct and that the resource exists. (Entity: ${apiBaseEntityName}, Method: ${httpMethod})`;
    }

    // Lógica para manejar las validaciones de rutas
    const routeConfig = apiExceptionConfig.notFound.routes.find(
      (route) =>
        route.method === httpMethod && request.url.startsWith(route.path), // Cambiado a startsWith
    );

    // Validar que la ID en la URL sea un número entero
    const idParam = request.params['id'];
    if (idParam && !Validator.isValidUUID(idParam)) {
      response.status(HttpStatus.BAD_REQUEST).json({
        code: apiExceptionConfig.badRequest.code, // Tipo de error
        message: `The parameter "id" must be a valid UUID. Provided: "${idParam}"`, // Mensaje indicando el parámetro faltante
        timestamp: new Date().toISOString(),
        service:
          apiMethodsName[
            httpMethod.toLowerCase() as keyof typeof apiMethodsName
          ], // Código HTTP
      });
      return;
    }

    // Respuesta para el caso de Not Found con la ruta encontrada
    if (routeConfig) {
      const validationConfig =
        apiExceptionConfig.validation.routes[httpMethod.toLowerCase()];
      if (validationConfig && validationConfig.path === routeConfig.path) {
        for (const param of validationConfig.requiredParams) {
          if (!request.params[param]) {
            // Si falta un parámetro requerido, devolver un error 400 Bad Request
            response.status(parseInt(apiExceptionConfig.badRequest.code)).json({
              code: apiExceptionConfig.badRequest.code, // Tipo de error
              message: `The parameter "${param}" is required for this route.`, // Mensaje indicando el parámetro faltante
              timestamp: new Date().toISOString(),
              service:
                apiMethodsName[
                  httpMethod.toLowerCase() as keyof typeof apiMethodsName
                ], // Código HTTP
            });
            return;
          }
        }
      }

      // Respuesta de error para el caso de Not Found
      response.status(parseInt(apiExceptionConfig.notFound.code)).json({
        code: apiExceptionConfig.notFound.code,
        message: customMessage,
        timestamp: new Date().toISOString(),
        service:
          apiMethodsName[
            httpMethod.toLowerCase() as keyof typeof apiMethodsName
          ], // Obtener el mensaje del método
      });
      return;
    }

    // Respuesta para el caso de Not Found genérico cuando no se encuentra la ruta
    response.status(HttpStatus.NOT_FOUND).json({
      code: apiExceptionConfig.notFound.code,
      message: customMessage,
      timestamp: new Date().toISOString(),
      service:
        apiMethodsName[httpMethod.toLowerCase() as keyof typeof apiMethodsName], // Obtener el mensaje del método
    });

    // Log de error para registrar detalles sobre la excepción
    const errorLogs = JSON.stringify({
      code: apiExceptionConfig.notFound.code,
      message: customMessage,
      timestamp: new Date().toISOString(),
      service:
        apiMethodsName[httpMethod.toLowerCase() as keyof typeof apiMethodsName], // Obtener el mensaje del método
    });
    this.logger.error(errorLogs); // Registro del error utilizando el servicio de logger
  }
}
