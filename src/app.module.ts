import { Module } from '@nestjs/common';
import { UserModule } from './core/infrastructure/adaptarts/modules/user.module';
//import { ConfigModule } from '@nestjs/config';
//import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    UserModule,
    //ConfigModule.forRoot({
    //envFilePath: `.env.${process.env.NODE_ENV || 'development'}`,
    //isGlobal: true, // Hace que el ConfigModule esté disponible en toda la app sin necesidad de importarlo en cada módulo
    //}),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
