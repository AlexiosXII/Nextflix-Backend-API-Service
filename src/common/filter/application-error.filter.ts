import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { I18nContext } from 'nestjs-i18n';
import { ApplicationError } from '../errors/application.error';
import { RequestContextService } from '../context/app-request-context';

@Catch(ApplicationError)
export class ApplicationExceptionFilter implements ExceptionFilter {
    catch(exception: ApplicationError, host: ArgumentsHost) {
        const i18n = I18nContext.current(host);
        const response = host.switchToHttp().getResponse<any>();

        const responseBody = {
            requestId: RequestContextService.getRequestId(),
            status: 'error',
            error: {
                code: exception.code,
                message: i18n.translate(`error.${exception.code}`),
            },
        };
        response.status(exception.getStatus()).send(responseBody);
    }
}
