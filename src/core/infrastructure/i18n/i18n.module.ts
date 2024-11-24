import { Module } from '@nestjs/common';
import { AcceptLanguageResolver, HeaderResolver, I18nModule, QueryResolver } from 'nestjs-i18n';
import * as path from 'path';

@Module({
  imports: [
    I18nModule.forRoot({
      fallbackLanguage: 'es',
      loaderOptions: {
        path: path.join(__dirname, './'), // Ajusta la ruta según la configuración del CLI
        watch: true,
      },
      resolvers: [
        { use: QueryResolver, options: ['lang'] },
        HeaderResolver,
        AcceptLanguageResolver,
      ],
    }),
  ],
})
export class I18nConfigModule { }
