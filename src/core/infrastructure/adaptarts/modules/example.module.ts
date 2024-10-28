import { Module } from '@nestjs/common';
import { ExampleController } from '../controllers/v1/example.controller';
import { ExampleService } from 'src/core/application/services/example.service';
import { PrismaService } from 'src/core/application/prisma/prisma.service';
import { LoggerModule } from 'src/core/application/loggger/logger.module';
import { HttpModule } from '@nestjs/axios';
import { AuthGuardModule } from 'auth-guard-michimoney';
import { AuthConfig } from 'auth-guard-michimoney/dist/auth-config.dto';
@Module({
  imports: [LoggerModule.register(process.env.USE_KAFKA === 'true')],
  controllers: [ExampleController],
  providers: [ExampleService, PrismaService],
})
export class ExampleModule {}
