import { MiddlewareConsumer, Module } from '@nestjs/common';
import { IdentificationController } from '../controllers/v1/identification.controller';
import { PrismaService } from 'src/core/application/prisma/prisma.service';
import { LoggerModule } from 'src/core/application/loggger/logger.module';
import { IdentificationService} from 'src/core/application/services/identification.service';

@Module({
  imports: [LoggerModule.register(process.env.USE_KAFKA === 'true')],
  controllers: [IdentificationController],
  providers: [IdentificationService, PrismaService],
})
export class IdentificationModule {}
