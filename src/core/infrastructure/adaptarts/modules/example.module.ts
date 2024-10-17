import { Module } from '@nestjs/common';
import { ExampleController } from '../controllers/v1/example.controller';
import { UserService } from 'src/core/application/services/user.service';
import { PrismaService } from 'src/core/application/prisma/prisma.service';
import { LoggerModule } from 'src/core/application/loggger/logger.module';

@Module({
  imports: [LoggerModule.register(process.env.USE_KAFKA === 'true')],
  controllers: [ExampleController],
  providers: [UserService, PrismaService],
})
export class ExampleModule {}
