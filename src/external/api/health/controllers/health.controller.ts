import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
@ApiTags('Health Check')
@Controller('health')
export class HealthController {
    @Get()
    async healthCheck(): Promise<boolean> {
        return true;
    }
}
