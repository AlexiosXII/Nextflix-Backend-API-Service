import { Module } from '@nestjs/common';
import { WinstonCustomModule } from './winston.module';

@Module({
    imports: [WinstonCustomModule],
    providers: [],
    exports: [],
})
export class LoggerModule {}
