import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import { RequestContextService } from '../context/app-request-context';
import { v4 as uuidv4 } from 'uuid';

/**
 * Interceptor that handles the context of each request.
 * It sets a unique request ID for each incoming request.
 *
 * @class
 * @implements {NestInterceptor}
 */
@Injectable()
export class ContextInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const request = context.switchToHttp().getRequest();
        const requestId = request?.headers['requestid'] || uuidv4();
        const lang = request?.headers['x-lang'] || 'en';
        RequestContextService.setRequestId(requestId);
        RequestContextService.setLang(lang);
        return next.handle().pipe(
            tap(() => {
                // Perform cleaning if needed
            }),
        );
    }
}
