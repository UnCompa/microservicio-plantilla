import { Controller, HttpCode, Post } from '@nestjs/common';
import { ApiCreatedResponse, ApiResponse, ApiTags } from '@nestjs/swagger';
import { apiStatus, createEntity } from 'src/utils/api/oneOperation/apiStatus';

//TODO: ELIMINAR ESTE CONTROLADOR EN CASO DE NO USARSE, SOLO SIRVE DE EJEMPLO
@ApiTags('pathDeTuServicio')
@Controller('pathDeTuServicio')
export class UserController {
  @ApiResponse(apiStatus.ok) //Respuesta de la api en swagger
  @ApiCreatedResponse(createEntity)
  @Post('path') // Metodo HTTP POST
  @HttpCode(201) // Codigo http
  async createUser() {
    //return this.userService.create(data);
  }
}
