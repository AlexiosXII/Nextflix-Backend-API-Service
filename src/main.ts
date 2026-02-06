import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import helmet from 'helmet';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    if (process.env.NODE_ENV !== 'local') {
        app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));
    }
    // app.use(helmet());
    // app.enableCors();
    app.enableShutdownHooks();

    const config = new DocumentBuilder()
        .setTitle('NestJS Onion Architecture API')
        .setDescription(
            'A RESTful API built with NestJS following Onion Architecture principles. This API provides user management and authentication services.',
        )
        .setVersion('1.0.0')
        .addTag('Authentication', 'Endpoints for user authentication')
        .addTag('Users', 'Endpoints for user management')
        .addBearerAuth(
            {
                type: 'http',
                scheme: 'bearer',
                bearerFormat: 'JWT',
                name: 'JWT',
                description: 'Enter JWT token',
                in: 'header',
            },
            'access-token',
        )
        .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);

    await app.listen(3000);
}

bootstrap();
