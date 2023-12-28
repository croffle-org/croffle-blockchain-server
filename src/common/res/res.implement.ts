import { DateTime } from 'luxon';

import { Res } from 'src/common/res/res.interface';

import { DEFAULT_DATE_TIME_FORMAT } from 'src/common/const/common.const';

// * common response
export class ResImpl implements Res {
    constructor(res: Res) {
        this.code = res['code'];
        this.message = res['message'];
        this.data = res['data'];
    }

    when: string = DateTime.now().setZone('Asia/Seoul').toFormat(DEFAULT_DATE_TIME_FORMAT);
    code: number;
    message: string;
    data?: object | Res;
}
