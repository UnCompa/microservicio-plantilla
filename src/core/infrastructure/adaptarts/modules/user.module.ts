import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { redisStore } from 'cache-manager-redis-yet';
import { LoggerModule } from 'src/core/application/loggger/logger.module';
import { PrismaService } from 'src/core/application/prisma/prisma.service';
import { UserService } from 'src/core/application/services/user.service';
import { UserController } from '../controllers/v1/user.controller';
@Module({
  imports: [
    LoggerModule.register(),
    CacheModule.register({
      store: redisStore,
      host: 'localhost', // Dirección del servidor Redis
      port: 6379,        // Puerto de Redis
      ttl: 600,          // Tiempo de vida en segundos (10 minutos)
    }),
  ],
  controllers: [UserController],
  providers: [UserService, PrismaService],
})
export class UserModule {}
