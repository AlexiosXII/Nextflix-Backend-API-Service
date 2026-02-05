import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { I18nContext } from 'nestjs-i18n';
import { RequestContextService } from '../context/app-request-context';
import { UnauthorizedError } from '../errors/unauthorized.error';

@Catch(UnauthorizedError)
export class UnauthorizedErrorFilter implements ExceptionFilter {
    catch(exception: UnauthorizedError, host: ArgumentsHost) {
        const i18n = I18nContext.current(host);
        const response = host.switchToHttp().getResponse<any>();

        const responseBody = {
            requestId: RequestContextService.getRequestId(),
            status: 'error',
            error: {
                code: exception.code,
                message: i18n ? i18n.translate(`error.${exception.code}`) : `error.${exception.code}`,
            },
        };
        response.status(exception.getStatus()).send(responseBody);
    }
}
