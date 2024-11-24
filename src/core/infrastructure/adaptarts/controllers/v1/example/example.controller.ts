import { Controller } from '@nestjs/common';
//import { CheckDatabaseConnectionGuard } from 'src/core/application/decorators/check-database.decorator';
import { ExampleService } from 'src/core/application/services/example.service';

//@ApiTags('/msa/example') Agrupar metodos, que se usaran en swagger
@Controller()
//@UseGuards(CheckDatabaseConnectionGuard) Activar si quieres comprobar que la base de datos este levantada, respondiendo un 408
export class ExampleController {
  constructor(private exampleService: ExampleService) {}
}
