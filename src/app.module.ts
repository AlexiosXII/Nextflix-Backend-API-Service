// NestJS Dependencies
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { APP_INTERCEPTOR, APP_FILTER } from '@nestjs/core'; // Add APP_FILTER
import { ThrottlerModule } from '@nestjs/throttler';
import { RequestContextModule } from 'nestjs-request-context';
import { I18nMiddleware, I18nModule, HeaderResolver, AcceptLanguageResolver, QueryResolver } from 'nestjs-i18n';
import { join } from 'path';

// Common
import { TimeoutInterceptor } from './common/interceptors/timeout.interceptor';
import { ContextInterceptor } from './common/interceptors/context.interceptor';
import { LoggerModule } from './common/logger/logger.module';
import { SuccessResponseInterceptor } from './common/interceptors/success-response.interceptor';
import { ApplicationExceptionFilter } from './common/filter/application-error.filter'; // Add this import

// Module
import { UserModule } from './external/api/user/user.module';
import { HealthModule } from './external/api/health/health.module';

@Module({
    imports: [
        // global modules
        RequestContextModule,
        ThrottlerModule.forRoot([
            {
                ttl: 60000,
                limit: 10,
            },
        ]),
        LoggerModule,

        // I18n configuration
        I18nModule.forRoot({
            fallbackLanguage: 'en',
            loaderOptions: {
                path: join(__dirname, '/i18n/'),
                watch: true,
            },
            resolvers: [
                { use: QueryResolver, options: ['lang'] },
                AcceptLanguageResolver,
                new HeaderResolver(['x-lang']),
            ],
        }),

        // application modules
        HealthModule,
        UserModule,
    ],
    providers: [
        {
            provide: APP_INTERCEPTOR,
            useClass: ContextInterceptor,
        },
        {
            provide: APP_INTERCEPTOR,
            useClass: TimeoutInterceptor,
        },
        {
            provide: APP_INTERCEPTOR,
            useClass: SuccessResponseInterceptor,
        },
        {
            provide: APP_FILTER,
            useClass: ApplicationExceptionFilter,
        },
    ],
})
export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(I18nMiddleware).forRoutes('*');
    }
}
