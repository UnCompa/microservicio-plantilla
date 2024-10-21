import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
//import { CheckDatabaseConnectionGuard } from 'src/core/application/decorators/check-database.decorator';
import { ExampleService } from 'src/core/application/services/user.service';
import { apiExceptionConfig } from 'src/utils/api/apiExceptionConfig';

//@ApiTags('/msa/example') Agrupar metodos, que se usaran en swagger
@Controller('/msa/example')
//@UseGuards(CheckDatabaseConnectionGuard) Activar si quieres comprobar que la base de datos este levantada, respondiendo un 408
export class ExampleController {
  constructor(private exampleService: ExampleService) {}

  @ApiResponse(apiExceptionConfig.notFound)
  //@ApiResponse(apiExceptionConfig.badRequest) Otros tipos de respuestas
  @Get()
  getMessage(): string {
    return this.exampleService.getHello()
  }
  //Tus rutas para el servicio
}
