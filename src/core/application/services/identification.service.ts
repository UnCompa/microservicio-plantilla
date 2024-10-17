import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { LoggerService } from '../loggger/logger.service';
import { Identification } from 'src/core/domain/identification.entity';

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    private logger: LoggerService,
  ) {}


  async findAll(): Promise<Identification[]> {
    const identifiction = await this.prisma.identificationTypes.findMany()
    this.logger.log(JSON.stringify(identifiction))
    return identifiction;
  }
}
