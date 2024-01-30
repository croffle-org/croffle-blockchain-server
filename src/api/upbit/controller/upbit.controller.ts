import { Body, Controller, Get, Post } from '@nestjs/common';

import { UpbitService } from 'src/api/upbit/service/upbit.service';

import { ResImpl } from 'src/common/res/res.implement';
import { Res } from 'src/common/res/res.interface';
import { SUCCESS } from 'src/common/const/error.const';

import { SetUpbitJwtReqDTO } from 'src/api/upbit/dto/upbit.req.dto';

@Controller({ version: '1', path: 'api/upbit' })
export class UpbitController {
    constructor(private readonly upbitService: UpbitService) {}

    @Post('/set/token')
    async setUpbitJwt(@Body() setUpbitJwtReqDTO: SetUpbitJwtReqDTO) {
        await this.upbitService.setUpbitJwt(setUpbitJwtReqDTO);
        return new ResImpl({ ...SUCCESS });
    }

    @Get('/get/token')
    async getUpbitJwt(): Promise<Res> {
        const token = await this.upbitService.getUpbitJwt();
        return new ResImpl({ ...SUCCESS, data: { token } });
    }
}
