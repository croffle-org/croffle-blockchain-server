import { HttpException, HttpStatus } from '@nestjs/common';

import { Res } from 'src/common/res/res.interface';
import { ResImpl } from 'src/common/res/res.implement';

// * 에러 예외 처리 응답
export class ResException extends HttpException {
    constructor(res: Res) {
        super(new ResImpl(res), HttpStatus.BAD_REQUEST);
    }
}
