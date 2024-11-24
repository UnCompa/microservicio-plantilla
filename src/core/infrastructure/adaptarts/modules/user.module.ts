import { Module } from '@nestjs/common';
import { UserController } from '../controllers/v1/user.controller';
import { UserService } from 'src/core/application/services/user.service';
import { PrismaService } from 'src/core/application/prisma/prisma.service';
import { LoggerModule } from 'src/core/application/loggger/logger.module';
import { CacheModule, CacheStore } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-yet';
@Module({
  imports: [
    LoggerModule.register(),
    CacheModule.register({
      useFactory: async () => {
        const store = await redisStore({
          socket: {
            host: 'localhost',
            port: 6379,
          },
        });

        return {
          store: store as unknown as CacheStore,
          ttl: 3 * 60000, // 3 minutes (milliseconds)
        };
      }
    })],
  controllers: [UserController],
  providers: [UserService, PrismaService],
})
export class UserModule { }
