import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { LoggerService } from '../loggger/logger.service';
//Si quieres usar el logger de kafka
//import { LoggerKafkaService } from '../loggger/loggerKafka.service';

@Injectable()
export class ExampleService {
  constructor(
    private prisma: PrismaService,
    private logger: LoggerService, //Usando el logger simple (No usa kafka)
  ) {}

  getHello(): string {
    return 'Hello world';
  }
  async create(): Promise<string> {
    return 'Your logic for create a entity';
  }
  async findAll() {
    return 'Your logic for create a entity';
  }
  async findOne() {
    return 'Your logic for create a entity';
  }
  async update() {
    return 'Your logic for create a entity';
  }
  async delete() {
    return 'Your logic for create a entity';
  }
}
