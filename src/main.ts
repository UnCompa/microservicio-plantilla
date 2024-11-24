import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { appConfig, helmetConfig } from './utils/config/app.config';
import { BadRequestExceptionFilter } from './core/application/exceptions/badRequest.exception';
import { MethodNotAllowedFilter } from './core/application/exceptions/methodNotAllow-exception';
import { NotFoundExceptionFilter } from './core/application/exceptions/notFound-exception';
import { ConflictExceptionFilter } from './core/application/exceptions/conflict.exception';
import { ForbiddenExceptionFilter } from './core/application/exceptions/forbidden.exception';
import { InternalServerErrorExceptionFilter } from './core/application/exceptions/internalServerError.exception';
import { ServiceUnavailableExceptionFilter } from './core/application/exceptions/serviceUnavailable.exception';
import { UnauthorizedExceptionFilter } from './core/application/exceptions/unauthorized.exception';
import helmet from 'helmet';
import { HttpExceptionFilter } from './core/application/exceptions/httpException';
import { LoggerService } from './core/application/loggger/logger.service';
import { apiSwaggerConfig } from './utils/config/swaggerConfig';

async function bootstrap() {
  // Crear la aplicación Nest.js
  const app = await NestFactory.create(AppModule);

  // Configurar logger dinámico (Kafka o consola/archivo según configuración)
  const loggerService = await app.resolve(LoggerService);

  // Establecer el logger personalizado en la app
  app.useLogger(loggerService);

  // Configuración de Helmet según entorno
  const env = process.env.NODE_ENV || 'dev';
  const selectedHelmetConfig = helmetConfig[env] || helmetConfig.dev;
  app.use(helmet(selectedHelmetConfig));

  // Configuración de CORS
  const allowCorsOrigin = process.env.CORS_ORIGINS?.split(',') ?? '*';
  app.enableCors({ origin: allowCorsOrigin });

  // Validaciones
  app.useGlobalPipes(new ValidationPipe());

  // Configurar filtros globales con logger
  app.useGlobalFilters(
    new HttpExceptionFilter(loggerService),
    new BadRequestExceptionFilter(loggerService),
    new NotFoundExceptionFilter(loggerService),
    new ConflictExceptionFilter(loggerService),
    new ForbiddenExceptionFilter(loggerService),
    new InternalServerErrorExceptionFilter(loggerService),
    new ServiceUnavailableExceptionFilter(loggerService),
    new UnauthorizedExceptionFilter(loggerService),
    new MethodNotAllowedFilter(loggerService),
  );

  // Configuración de Swagger
  const config = apiSwaggerConfig(appConfig.mode); // Usar la configuración externa
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  //Versionado de apis (v1.0)
  app.setGlobalPrefix('v1.0')
  // Levantar Microservicio
  await app.listen(appConfig.port);
  loggerService.log(`🚀 Microservice started on port ${appConfig.port} in ${appConfig.mode.toUpperCase()} mode`);
}

bootstrap();
