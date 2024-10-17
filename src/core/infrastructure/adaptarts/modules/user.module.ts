import { MiddlewareConsumer, Module } from '@nestjs/common';
import { UserController } from '../controllers/v1/user.controller';
import { PrismaService } from 'src/core/application/prisma/prisma.service';
import { LoggerModule } from 'src/core/application/loggger/logger.module';
import { UserService } from 'src/core/application/services/identification.service';

@Module({
  imports: [LoggerModule.register(process.env.USE_KAFKA === 'true')],
  controllers: [UserController],
  providers: [UserService, PrismaService],
})
export class UserModule {}
