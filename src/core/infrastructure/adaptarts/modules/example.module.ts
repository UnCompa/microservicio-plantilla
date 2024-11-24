import { Module } from '@nestjs/common';
import { ExampleController } from '../controllers/v1/example.controller';
import { ExampleService } from 'src/core/application/services/example.service';
import { PrismaService } from 'src/core/application/prisma/prisma.service';
import { LoggerModule } from 'src/core/application/loggger/logger.module';

@Module({
  imports: [LoggerModule.register()],
  controllers: [ExampleController],
  providers: [ExampleService, PrismaService],
})
export class ExampleModule { }
