import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ExampleService } from 'src/core/application/services/user.service';

@ApiTags('/msa/users')
@Controller('/msa/users')
export class ExampleController {
  constructor(private exampleService: ExampleService) {}

  //Tus rutas para el servicio
}
