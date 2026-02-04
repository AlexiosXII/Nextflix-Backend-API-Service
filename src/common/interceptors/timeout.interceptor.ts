import { Injectable, NestInterceptor, ExecutionContext, CallHandler, RequestTimeoutException } from '@nestjs/common';
import { Observable, TimeoutError } from 'rxjs';
import { catchError, timeout } from 'rxjs/operators';

/**
 * Interceptor that adds a timeout to the request.
 */
@Injectable()
export class TimeoutInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
        return next.handle().pipe(
            timeout(5000),
            catchError((error) => {
                if (error instanceof TimeoutError) {
                    throw new RequestTimeoutException();
                }
                throw error;
            }),
        );
    }
}
