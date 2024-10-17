import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { LoggerService } from '../loggger/logger.service';

@Injectable()
export class ExampleService {
  constructor(
    private prisma: PrismaService,
    private logger: LoggerService,
  ) {}

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
