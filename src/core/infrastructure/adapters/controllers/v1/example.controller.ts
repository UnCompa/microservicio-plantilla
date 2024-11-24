import { Controller, Get } from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';
//import { CheckDatabaseConnectionGuard } from 'src/core/application/decorators/check-database.decorator';

@Controller()
//@UseGuards(CheckDatabaseConnectionGuard) Activar si quieres comprobar que la base de datos este levantada, respondiendo un 408
export class ExampleController {
  constructor(private readonly i18n: I18nService) {}

  @Get()
  async getHello(): Promise<unknown> {
    const message = this.i18n.translate('common.HELLO');
    console.log(message);

    return message; // Retorna "Hola"
  }
}
