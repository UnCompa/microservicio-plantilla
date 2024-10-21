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
    const clientId = process.env.KAFKA_TOPIC || 'logger-service';
    this.kafkaLogger = new KafkaLogger(brokers, topic, clientId);
    this.kafkaLogger.connect();
  }

  async log(message: string, method?: string) {
    await super.log(message); // Llama al método log de la clase base (Winston)
    await this.kafkaLogger.logMessage(
      'info',
      this.messageFormat(message, 'INFO'),
    ); // Log en Kafka
  }

  async error(message: string) {
    await super.error(message); // Llama al método error de la clase base (Winston)
    await this.kafkaLogger.logMessage(
      'error',
      this.messageFormat(message, 'ERROR'),
    ); // Log en Kafka
  }

  async warn(message: string) {
    await super.warn(message); // Llama al método warn de la clase base (Winston)
    await this.kafkaLogger.logMessage(
      'warn',
      this.messageFormat(message, 'WARN'),
    ); // Log en Kafka
  }

  async debug(message: string) {
    await super.debug(message); // Llama al método debug de la clase base (Winston)
    await this.kafkaLogger.logMessage(
      'debug',
      this.messageFormat(message, 'DEBUG'),
    ); // Log en Kafka
  }

  async verbose(message: string) {
    await super.verbose(message); // Llama al método verbose de la clase base (Winston)
    await this.kafkaLogger.logMessage(
      'verbose',
      this.messageFormat(message, 'VERBOSE'),
    ); // Log en Kafka
  }

  // Función auxiliar para formatear el mensaje
  private messageFormat(message: string, level: string): string {
    const date = new Date().toISOString();
    return `${date} - [${level.toUpperCase()}] ${message}`;
  }
}
