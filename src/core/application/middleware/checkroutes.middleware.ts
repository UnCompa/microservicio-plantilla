import {
  Injectable,
  NestMiddleware,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { match } from 'path-to-regexp';
import { enablePathMethods } from 'src/utils/api/apiEnableMethods';

@Injectable()
export class PathMethodMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const method = req.method.toLowerCase(); // Obtener el método HTTP (get, post, etc.)
    const path = req.baseUrl; // Obtener el path solicitado

    // Verificar si el método existe en la configuración
    if (enablePathMethods[method]) {
      // Recorrer las rutas permitidas para el método
      const isRouteAllowed = enablePathMethods[method].some((allowedPath) => {
        const matcher = match(allowedPath, { decode: decodeURIComponent });
        return matcher(path); // Verifica si la ruta solicitada coincide con alguna ruta permitida
      });

      if (isRouteAllowed) {
        return next(); // Continuamos si está permitido
      }
    }

    // Si la ruta o el método no están permitidos, lanzamos una excepción
    throw new HttpException(
      `Method ${req.method} is not allowed for the path: ${path}`,
      HttpStatus.METHOD_NOT_ALLOWED,
    );
  }
}
