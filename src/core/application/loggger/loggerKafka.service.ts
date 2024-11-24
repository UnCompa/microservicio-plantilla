import { Injectable } from '@nestjs/common';
import { LoggerService } from './logger.service';
import { KafkaLogger } from 'kafka-logger-mm'; // Librería de Kafka
import { messageCustom } from 'src/utils/api/apiKafkaLogConfig';
import { apiBaseEntityName } from 'src/utils/api/apiEntites';

@Injectable()
export class LoggerKafkaService extends LoggerService {
  private readonly kafkaLogger: KafkaLogger;

  constructor() {
    super();
    console.log('LoggerKafkaService instantiated');
    const brokers = process.env.KAFKA_BROKERS?.split(',') || ['0.0.0.0:9092'];
    const topic = process.env.KAFKA_TOPIC || 'example';

    this.kafkaLogger = new KafkaLogger(brokers, topic);
    console.log('LoggerKafkaService connected');

    try {
      this.kafkaLogger.connect();
    } catch (error) {
      super.error('Error connecting to Kafka: ' + error.message, undefined, 'KafkaService');
    }
  }

  private buildMessage(
    message: string | object,
    method: string,
    entity: string,
    level: string,
  ): any {
    const formattedMessage =
      typeof message === 'object' ? JSON.stringify(message) : message;

    return messageCustom(
      formattedMessage,
      method,
      entity,
      level,
    );
  }

  private async logToKafka(level: string, message: any): Promise<void> {
    try {
      await this.kafkaLogger.logCustomMessage(level, message);
    } catch (error) {
      super.error(
        `Failed to log message to Kafka. Level: ${level}, Error: ${error.message}`,
        undefined,
        'KafkaService',
      );
    }
  }

  async log(
    message: string | object,
    method: string = 'GET',
    entity: string = apiBaseEntityName,
    context: string = 'APP',
  ): Promise<void> {
    const builtMessage = this.buildMessage(message, method, entity, 'INFO');
    super.log(message, context); // Log en consola y archivos
    await this.logToKafka('INFO', builtMessage); // Log en Kafka
  }

  async error(
    message: string | object,
    trace?: string,
    method: string = 'GET',
    entity: string = apiBaseEntityName,
    context: string = 'APP',
  ): Promise<void> {
    const builtMessage = this.buildMessage(message, method, entity, 'ERROR');
    super.error(message, trace, context); // Log en consola y archivos
    await this.logToKafka('ERROR', builtMessage); // Log en Kafka
  }

  async warn(
    message: string | object,
    method: string = 'GET',
    entity: string = apiBaseEntityName,
    context: string = 'APP',
  ): Promise<void> {
    const builtMessage = this.buildMessage(message, method, entity, 'WARN');
    super.warn(message, context); // Log en consola y archivos
    await this.logToKafka('WARN', builtMessage); // Log en Kafka
  }

  async debug(
    message: string | object,
    method: string = 'GET',
    entity: string = apiBaseEntityName,
    context: string = 'APP',
  ): Promise<void> {
    const builtMessage = this.buildMessage(message, method, entity, 'DEBUG');
    super.debug(message, context); // Log en consola y archivos
    await this.logToKafka('DEBUG', builtMessage); // Log en Kafka
  }

  async verbose(
    message: string | object,
    method: string = 'GET',
    entity: string = apiBaseEntityName,
    context: string = 'APP',
  ): Promise<void> {
    const builtMessage = this.buildMessage(message, method, entity, 'VERBOSE');
    super.verbose(message, context); // Log en consola y archivos
    await this.logToKafka('VERBOSE', builtMessage); // Log en Kafka
  }
}
