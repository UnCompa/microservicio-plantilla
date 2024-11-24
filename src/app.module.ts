import { HttpModule } from '@nestjs/axios';
import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TerminusModule } from '@nestjs/terminus';
import { ThrottlerModule } from '@nestjs/throttler';
import { LoggerModule } from './core/application/loggger/logger.module';
import { PathMethodMiddleware } from './core/application/middleware/checkroutes.middleware';
import { PrismaService } from './core/application/prisma/prisma.service';
import { HealthController } from './core/infrastructure/adapters/controllers/v1/healt.controller';
import { ExampleModule } from './core/infrastructure/adapters/modules/example.module';
import { UserModule } from './core/infrastructure/adapters/modules/user.module';
import { I18nConfigModule } from './core/infrastructure/i18n/i18n.module';
import { validationSchemaEnvs } from './utils/config/valtidationEnvs';
@Module({
  imports: [
    ExampleModule,
    UserModule,
    TerminusModule,
    HttpModule,
    I18nConfigModule,
    ConfigModule.forRoot({
      //envFilePath: `.env.${process.env.NODE_ENV || 'development'}`,
      isGlobal: true, // Hace que el ConfigModule esté disponible en toda la app sin necesidad de importarlo en cada módulo
      validationSchema: validationSchemaEnvs,
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 60,
        limit: 10,
      },
    ]),
    LoggerModule.register(),
  ],
  controllers: [HealthController],
  providers: [PrismaService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(PathMethodMiddleware).forRoutes('*');
  }
}
