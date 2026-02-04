import { Module } from '@nestjs/common';
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import { RequestContextService } from '../context/app-request-context';

@Module({
    imports: [
        WinstonModule.forRootAsync({
            useFactory: () => ({
                exitOnError: false,
                // Use npm log levels instead of syslog levels
                levels: winston.config.npm.levels,
                level: 'debug', // Set the minimum log level to debug
                format: winston.format.combine(
                    winston.format.label({ label: 'main' }),
                    winston.format.timestamp(),
                    winston.format.json(),
                ),
                transports: [
                    new winston.transports.Console({
                        level: 'debug', // Set console transport to log debug messages
                        format: winston.format.combine(
                            winston.format.label({ label: 'main' }),
                            winston.format.timestamp(),
                            winston.format.printf(
                                (info) =>
                                    `[${info.timestamp}] [${RequestContextService.getRequestId()}] [${info.context}] [${info.level}]: ${info.message}`,
                            ),
                        ),
                    }),
                ],
            }),
        }),
    ],
})
export class WinstonCustomModule {}
