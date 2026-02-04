import { Injectable, NestInterceptor, ExecutionContext, CallHandler, Logger } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { RequestContextService } from '../context/app-request-context';

/**
 * Interceptor that handles the response of HTTP requests.
 */
@Injectable()
export class SuccessResponseInterceptor implements NestInterceptor {
    private readonly logger = new Logger(SuccessResponseInterceptor.name);

    intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
        const now = Date.now();
        return next.handle().pipe(
            map((result) => {
                if (result?.custom === true) {
                    return result.data;
                }
                const requestId = RequestContextService.getRequestId();
                const res = {
                    requestId: requestId,
                    status: 'success',
                    message: 'Operation completed successfully',
                    data: result === undefined ? {} : result,
                };
                this.logger.debug(`Time execute ${Date.now() - now}ms`);
                this.logger.debug(`Response ${JSON.stringify(res)}`);
                return res;
            }),
        );
    }
}
