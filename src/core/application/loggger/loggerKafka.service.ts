import { Injectable } from '@nestjs/common';
import { KafkaLogger } from 'kafka-logger-mm'; // Librería de Kafka
import { LoggerService } from './logger.service';
import { messageCustom } from 'src/utils/api/apiKafkaLogConfig';

@Injectable()
export class LoggerKafkaService extends LoggerService {
  private kafkaLogger: KafkaLogger;

  constructor() {
    super();
    const brokers = process.env.KAFKA_BROKERS?.split(',') || [
      'localhost:9092',
    ];
    const topic = process.env.KAFKA_TOPIC || 'test-topic';

    this.kafkaLogger = new KafkaLogger(brokers, topic);
    this.kafkaLogger.connect();
  }

  async log(message: string, method?: string, entity?: string) {
    const mensaje = messageCustom(message, method, entity, 'INFO');
    await this.kafkaLogger.logCustomMessage('INFO', mensaje);
  }

  async error(message: string, method?: string, entity?: string) {
    const mensaje = messageCustom(message, method, entity, 'ERROR');
    await this.kafkaLogger.logCustomMessage('ERROR', mensaje);
  }

  async warn(message: string, method?: string, entity?: string) {
    const mensaje = messageCustom(message, method, entity, 'WARN');
    await this.kafkaLogger.logCustomMessage('WARN', JSON.stringify(mensaje));
  }

  async debug(message: string, method?: string, entity?: string) {
    const mensaje = messageCustom(message, method, entity, 'DEBUG');
    await this.kafkaLogger.logCustomMessage('DEBUG', JSON.stringify(mensaje));
  }

  async verbose(message: string, method?: string, entity?: string) {
    const mensaje = messageCustom(message, method, entity, 'VERBOSE');
    await this.kafkaLogger.logCustomMessage('VERBOSE', JSON.stringify(mensaje));
  }

  // Función auxiliar para formatear el mensaje
  private messageFormat(message: string, level: string): string {
    const date = new Date().toISOString();
    return `${date} - [${level.toUpperCase()}] ${message}`;
  }
}
