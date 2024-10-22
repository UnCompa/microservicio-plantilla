import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { LoggerService } from './core/application/loggger/logger.service';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { appConfig } from './utils/config/app.config';
import { BadRequestExceptionFilter } from './core/application/exceptions/badRequest.exception';
import { MethodNotAllowedFilter } from './core/application/exceptions/methodNotAllow-exception';
import { NotFoundExceptionFilter } from './core/application/exceptions/notFound-exception';
import { ConflictExceptionFilter } from './core/application/exceptions/conflict.exception';
import { ForbiddenExceptionFilter } from './core/application/exceptions/forbidden.exception';
import { InternalServerErrorExceptionFilter } from './core/application/exceptions/internalServerError.exception';
import { ServiceUnavailableExceptionFilter } from './core/application/exceptions/serviceUnavailable.exception';
import { UnauthorizedExceptionFilter } from './core/application/exceptions/unauthorized.exception';
import { LoggerKafkaService } from './core/application/loggger/loggerKafka.service';
import { ConfigService } from '@nestjs/config';
async function bootstrap() {
  //Establecer logger e inicializar NEST
  const logger =
    process.env.USE_KAFKA == 'true'
      ? new LoggerKafkaService()
      : new LoggerService();
  const app = await NestFactory.create(AppModule, {
    logger:
      process.env.USE_KAFKA == 'true'
        ? new LoggerKafkaService()
        : new LoggerService(),
  });
  const loggerService = new LoggerService();
  const kafkaLoggerService = new LoggerKafkaService();
  const configService = app.get(ConfigService);
  // Validaciones
  app.useGlobalPipes(new ValidationPipe());
  //Configurar el swaggwer
  const config = new DocumentBuilder()
    .setTitle('User Microservicie')
    .setDescription(`Microservicio de usuario para el modo ${appConfig.mode}`)
    .setVersion('1.0')
    .build();
  app.useGlobalFilters(
    new BadRequestExceptionFilter(
      loggerService,
      kafkaLoggerService,
      configService,
    ),
    new NotFoundExceptionFilter(
      loggerService,
      kafkaLoggerService,
      configService,
    ),
    new ConflictExceptionFilter(
      loggerService,
      kafkaLoggerService,
      configService,
    ),
    new ForbiddenExceptionFilter(loggerService),
    new InternalServerErrorExceptionFilter(loggerService),
    new ServiceUnavailableExceptionFilter(loggerService),
    new UnauthorizedExceptionFilter(loggerService),
    new MethodNotAllowedFilter(
      loggerService,
      kafkaLoggerService,
      configService,
    ),
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
