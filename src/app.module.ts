import { MiddlewareConsumer, Module } from '@nestjs/common';
import { PathMethodMiddleware } from './core/application/middleware/checkroutes.middleware';
import { ExampleModule } from './core/infrastructure/adaptarts/modules/example.module';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { validationSchemaEnvs } from './utils/config/valtidationEnvs';
import { LoggerModule } from './core/application/loggger/logger.module';
import { UserModule } from './core/infrastructure/adaptarts/modules/user.module';

@Module({
  imports: [
    ExampleModule,
    UserModule,
    ConfigModule.forRoot({
      //envFilePath: `.env.${process.env.NODE_ENV || 'development'}`,
      isGlobal: true, // Hace que el ConfigModule esté disponible en toda la app sin necesidad de importarlo en cada módulo
      validationSchema: validationSchemaEnvs
    }),
    ThrottlerModule.forRoot([{
      ttl: 60,
      limit: 10,
    }]),
    LoggerModule.register()
  ],
  controllers: [],
  providers: [],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(PathMethodMiddleware).forRoutes('*');
  }
}
