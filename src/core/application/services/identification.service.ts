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
export class IdentificationService {
  constructor(
    private prisma: PrismaService,
    private logger: LoggerService,
  ) {}


  async findAll(): Promise<Pick<Identification, 'name' |'id_type_identification'>[]> {
    const identifiction = await this.prisma.type_identification.findMany()
    this.logger.log(JSON.stringify(identifiction))
    return identifiction;
  }
}
