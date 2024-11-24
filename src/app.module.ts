import { HttpModule } from '@nestjs/axios';
import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { TerminusModule } from '@nestjs/terminus';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { LoggerModule } from './core/application/loggger/logger.module';
import { PathMethodMiddleware } from './core/application/middleware/checkroutes.middleware';
import { PrismaService } from './core/application/prisma/prisma.service';
import { HealthController } from './core/infrastructure/adaptarts/controllers/v1/health/healt.controller';
import { ExampleModule } from './core/infrastructure/adaptarts/modules/example.module';
import { validationSchemaEnvs } from './utils/config/validation';
@Module({
  imports: [
    ExampleModule,
    TerminusModule, //Para validar la salud del proyecto
    HttpModule, //Modulo requerido para validar la salud del proyecto
    ConfigModule.forRoot({
      //envFilePath: `.env.${process.env.NODE_ENV || 'development'}`,
      isGlobal: true, // Hace que el ConfigModule esté disponible en toda la app sin necesidad de importarlo en cada módulo
      validationSchema: validationSchemaEnvs,
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 10,
        name: 'Throttler',
      },
    ]),
    LoggerModule.register(),
  ],
  controllers: [HealthController],

  providers: [
    PrismaService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(PathMethodMiddleware).forRoutes('*');
  }
}
