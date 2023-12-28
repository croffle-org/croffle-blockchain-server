import { Controller, Get } from '@nestjs/common';

import { ResImpl } from 'src/common/res/res.implement';
import { SUCCESS } from 'src/common/const/error.const';

@Controller({ path: '/health/check' })
export class HealthController {
    @Get('')
    healthCheck(): object {
        return new ResImpl({ ...SUCCESS });
    }
}
