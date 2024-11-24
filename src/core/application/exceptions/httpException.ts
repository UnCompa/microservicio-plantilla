import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { apiExceptionConfig } from 'src/utils/api/apiExceptionConfig';
import { apiMethodsName, setMethodsName } from 'src/utils/api/apiMethodsName';
import { LoggerService } from '../loggger/logger.service';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(private logger: LoggerService) { }
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const httpMethod = request.method.toLowerCase(); // Obtener el método HTTP
    const status = exception.getStatus
      ? exception.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR;
    const routeConfig = this.getRouteConfig(httpMethod, request.originalUrl);
    const entity = routeConfig.entity || this.getEntityFromMethod(httpMethod);
    const customMessage = exception.getResponse() || 'Error :c';

    let entityApi;
    if (routeConfig.entity) {
      entityApi = routeConfig.entity;
    } else {
      entityApi = entity;
    }

    if (response.headersSent) {
      return; // Si los encabezados ya han sido enviados, no hacemos nada más
    }

    if (typeof customMessage === 'object') {
      const customResponse = {
        code: status,
        timestamp: new Date().toISOString(),
        service: setMethodsName(httpMethod.toLowerCase(), entityApi),
        ...customMessage
      };
      this.logger.error(JSON.stringify(customResponse));
      return response.status(status).json(customMessage); // Se envía solo una vez
    }
    const customResponse = {
      code: status,
      message: customMessage,
      timestamp: new Date().toISOString(),
      service: setMethodsName(httpMethod.toLowerCase(), entityApi),
    };
    this.logger.error(JSON.stringify(customResponse));
    response.status(status).json(customResponse);
  }
  private getEntityFromMethod(httpMethod: string) {
    return apiMethodsName[
      httpMethod.toLowerCase() as keyof typeof apiMethodsName
    ];
  }

  private getRouteConfig(httpMethod: string, url: string) {
    const defaultRouteConfig = {
      entity: this.getEntityFromMethod(httpMethod), // Usar getEntityFromMethod como valor por defecto
      method: httpMethod,
      path: url,
    };
    const cleanPath = (path: string) => path.replace(/\.$/, '');
    let configRoute = apiExceptionConfig.notFound.routes.find((route) => {
      const cleanedRoutePath = cleanPath(route.path);
      const cleanedUrl = cleanPath(url);
      if (!cleanedUrl.startsWith(cleanedRoutePath)) {
        const idsUrl = cleanedRoutePath.split(':')[0];
        return route.method === httpMethod && cleanedUrl.startsWith(idsUrl);
      }
      return (
        route.method === httpMethod && cleanedUrl.startsWith(cleanedRoutePath)
      );
    });
    if (configRoute === undefined) {
      configRoute = apiExceptionConfig.methodNotAllowed.routes.find((route) => {
        const cleanedRoutePath = cleanPath(route.path);
        const cleanedUrl = cleanPath(url);
        if (!cleanedUrl.startsWith(cleanedRoutePath)) {
          const idsUrl = cleanedRoutePath.split(':')[0];
          return cleanedUrl.startsWith(idsUrl);
        }
        return cleanedUrl.startsWith(cleanedRoutePath);
      });
      if (configRoute !== undefined && configRoute.method !== httpMethod) {
        configRoute.method = httpMethod;
      }
    }
    return configRoute || defaultRouteConfig;
  }
}
