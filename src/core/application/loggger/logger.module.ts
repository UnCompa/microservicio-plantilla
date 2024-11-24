import { Module, DynamicModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { LoggerService } from './logger.service';
import { LoggerKafkaService } from './loggerKafka.service';

@Module({
  imports: [ConfigModule], // Importa ConfigModule para manejo de variables de entorno
})
export class LoggerModule {
  static register(): DynamicModule {
    const useKafka = process.env.USE_KAFKA === 'true';

    const loggerProvider = {
      provide: LoggerService,
      useClass: useKafka ? LoggerKafkaService : LoggerService,
    };

    return {
      module: LoggerModule,
      providers: [loggerProvider],
      exports: [LoggerService],
    };
  }
}
