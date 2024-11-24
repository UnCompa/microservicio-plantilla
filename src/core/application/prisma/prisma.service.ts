import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaClientInitializationError } from '@prisma/client/runtime/library';
import { LoggerService } from '../loggger/logger.service';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  private readonly logger = new LoggerService();

  private readonly retryDelay = 5000; // Intentar reconectar cada 5 segundos
  private readonly maxRetries = 5; // Número máximo de intentos
  private retryCount = 0; // Contador de intentos
  private retryInterval: NodeJS.Timeout;

  public isConnected = false; // Estado de la conexión

  async onModuleInit() {
    await this.connectToDatabase();
  }

  async onModuleDestroy() {
    this.stopRetryingConnection();
    await this.$disconnect();
  }

  private async connectToDatabase() {
    try {
      await this.$connect();
      this.isConnected = true;
      this.retryCount = 0;
      this.logger.log('Connected to the database');
    } catch (error) {
      this.isConnected = false;
      if (error instanceof PrismaClientInitializationError) {
        this.logger.error(
          'Failed to connect to the database. Retrying in 5 seconds...',
        );
        this.logger.error(error.message);
      } else {
        this.logger.error('Unexpected error during Prisma initialization');
        this.logger.error(error);
      }
      this.scheduleRetry();
    }
  }

  private scheduleRetry() {
    this.stopRetryingConnection(); // Asegurarse de que no haya intervalos anteriores
    this.retryInterval = setTimeout(
      () => this.connectToDatabase(),
      this.retryDelay,
    );
  }

  private stopRetryingConnection() {
    if (this.retryInterval) {
      clearTimeout(this.retryInterval);
    }
  }
}
