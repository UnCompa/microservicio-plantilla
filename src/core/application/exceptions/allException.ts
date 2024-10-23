import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  InternalServerErrorException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { LoggerService } from '../loggger/logger.service';
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(private readonly logger: LoggerService) {}

  catch(exception: InternalServerErrorException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status = HttpStatus.INTERNAL_SERVER_ERROR;
    const path = request.originalUrl;
    const httpMethod = request.method.toUpperCase();
    const customMessage = 'Internal Server Error'; // Puedes cambiar este mensaje si deseas algo más descriptivo

    // Crear el log de error personalizado
    const errorResponse = this.createErrorLog(
      exception,
      status,
      httpMethod,
      path,
      customMessage,
    );

    // Loguear el error
    this.logger.error(JSON.stringify(errorResponse));

    // Responder con el formato personalizado
    return response.status(status).json(errorResponse);
  }

  // Crear log de error para respuestas personalizadas
  private createErrorLog(
    exception: InternalServerErrorException,
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
      method: httpMethod,
    };
  }
}
