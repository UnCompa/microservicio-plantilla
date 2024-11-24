import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { LoggerService } from '../loggger/logger.service';
@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(private readonly logger: LoggerService) { }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const now = Date.now();
    const ctx = context.switchToHttp();
    const request = ctx.getRequest();
    // Logging request details
    const reequestLog = {
      path: request.url,
      method: request.method,
      body: request.body,
    };
    this.logger.log({
      message: JSON.stringify(reequestLog),
      appUser: request.headers?.from,
    });
    // Log the response and timing after processing
    return next.handle().pipe(
      map((data) => {
        this.logger.log(
          {
            message: data,
            duration: `${Date.now() - now}ms`,
            appUser: request.headers?.from,
          },
          request.method,
        );
        return data;
      }),
    );
  }
}
