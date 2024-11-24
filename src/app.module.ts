import { HttpModule } from '@nestjs/axios';
import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { TerminusModule } from '@nestjs/terminus';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { LoggerModule } from './core/application/loggger/logger.module';
import { PathMethodMiddleware } from './core/application/middleware/checkroutes.middleware';
import { PrismaService } from './core/application/prisma/prisma.service';
import { HealthController } from './core/infrastructure/adaptarts/controllers/v1/healt.controller';
import { ExampleModule } from './core/infrastructure/adaptarts/modules/example.module';
import { UserModule } from './core/infrastructure/adaptarts/modules/user.module';
import { validationSchemaEnvs } from './utils/config/valtidationEnvs';
@Module({
  imports: [
    ExampleModule,
    UserModule,
    TerminusModule,
    HttpModule,
    ConfigModule.forRoot({
      envFilePath: [
        `.env.${process.env.NODE_ENV}`, // Usará el archivo basado en NODE_ENV
        '.env', // Fallback al archivo .env por defecto si no encuentra el anterior
      ],
      isGlobal: true, // Hace que el ConfigModule esté disponible en toda la app sin necesidad de importarlo en cada módulo
      validationSchema: validationSchemaEnvs,
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 10,
      },
    ]),
    LoggerModule.register(),
  ],
  controllers: [HealthController],
  providers: [PrismaService, { provide: APP_GUARD, useClass: ThrottlerGuard }],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(PathMethodMiddleware).forRoutes('*');
  }
}
