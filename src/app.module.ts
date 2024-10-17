import { Module } from '@nestjs/common';
import { IdentificationModule } from './core/infrastructure/adaptarts/modules/identification.module';
//import { ConfigModule } from '@nestjs/config';
//import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    IdentificationModule,
    //ConfigModule.forRoot({
    //envFilePath: `.env.${process.env.NODE_ENV || 'development'}`,
    //isGlobal: true, // Hace que el ConfigModule esté disponible en toda la app sin necesidad de importarlo en cada módulo
    //}),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
