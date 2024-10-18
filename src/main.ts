import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { LoggerService } from './core/application/loggger/logger.service';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { appConfig } from './utils/config/app.config';
import { BadRequestExceptionFilter } from './core/application/exceptions/bad-request.exception';
import { MethodNotAllowedFilter } from './core/application/exceptions/method-not-allow-exception';
import { NotFoundExceptionFilter } from './core/application/exceptions/not-found-exception';
import { ConflictExceptionFilter } from './core/application/exceptions/conflict.exception';
import { ForbiddenExceptionFilter } from './core/application/exceptions/forbidden.exception';
import { InternalServerErrorExceptionFilter } from './core/application/exceptions/internal-server-error.exception';
import { ServiceUnavailableExceptionFilter } from './core/application/exceptions/service-unavailable.exception';
import { UnauthorizedExceptionFilter } from './core/application/exceptions/unauthorized.exception';
import { LoggerKafkaService } from './core/application/loggger/loggerKafka.service';

async function bootstrap() {
  //Establecer logger e inicializar NEST
  const logger =
    process.env.USE_KAFKA == 'true'
      ? new LoggerKafkaService()
      : new LoggerService();
  const app = await NestFactory.create(AppModule, {
    logger: logger,
  });
  // Validaciones
  app.useGlobalPipes(new ValidationPipe());
  //Configurar el swaggwer
  const config = new DocumentBuilder()
    .setTitle('User Microservicie')
    .setDescription(`Microservicio de usuario para el modo ${appConfig.mode}`)
    .setVersion('1.0')
    .build();
  app.useGlobalFilters(
    new BadRequestExceptionFilter(logger),
    new NotFoundExceptionFilter(logger),
    new ConflictExceptionFilter(logger),
    new ForbiddenExceptionFilter(logger),
    new InternalServerErrorExceptionFilter(logger),
    new ServiceUnavailableExceptionFilter(logger),
    new UnauthorizedExceptionFilter(logger),
    new MethodNotAllowedFilter(logger),
  );
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  //Levantar Microservicio
  await app.listen(appConfig.port, '0.0.0.0');
  logger.log(
    `🚀 Microservice started on port ${appConfig.port} in ${appConfig.mode.toUpperCase()} mode`,
  );
}
bootstrap();
