import { Controller, HttpCode, Post } from '@nestjs/common';
import { ApiCreatedResponse, ApiResponse, ApiTags } from '@nestjs/swagger';
import { apiStatus, createEntity } from 'src/utils/api/apiStatus';

@ApiTags('pathDeTuServicio')
@Controller('pathDeTuServicio')
export class UserController {
  @ApiResponse(apiStatus.ok) //Respuesta de la api
  @ApiCreatedResponse(createEntity)
  @Post('path') // Metodo http
  @HttpCode(201) // Codigo http
  async createUser() {
    //return this.userService.create(data);
  }

  //
}
