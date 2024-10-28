import { Module } from '@nestjs/common';
import { UserController } from '../controllers/v1/user.controller';
import { UserService } from 'src/core/application/services/user.service';
import { PrismaService } from 'src/core/application/prisma/prisma.service';
import { LoggerModule } from 'src/core/application/loggger/logger.module';
import { HttpModule } from '@nestjs/axios';
import { AuthGuardModule } from 'auth-guard-michimoney';
import { AuthConfig } from 'auth-guard-michimoney/dist/auth-config.dto';
@Module({



  
  imports: [
    LoggerModule.register(process.env.USE_KAFKA === 'true'),
    HttpModule,
    AuthGuardModule.register({
      introspectionUrl:
        'http://localhost:8080/realms/MICHIMONEY/protocol/openid-connect/token/introspect',
      clientId: 'mi-app',
      clientSecret: 'cWBFSs49Zp5cSOdvTv25KMLgYIQgXJIF',
    } as AuthConfig), // Proporciona la configuración aquí
  ],
  controllers: [UserController],
  providers: [UserService, PrismaService],
})
export class UserModule {}
