import { Expose } from 'class-transformer';
import { IsEnum, IsString } from 'class-validator';

import { WithdrawList } from 'src/model/entity/withdraw-list.entity';
import { CURRENCY } from 'src/common/const/enum.const';

export class GetTotalWithdrawAmountForTokensReqDTO {
    @Expose({ name: 'croffle_address' })
    @IsString()
    croffle_address: string;

    @Expose({ name: 'currency' })
    @IsEnum(CURRENCY)
    currency: CURRENCY;
}

export class InsertRefundInformationReqDTO {
    @Expose({ name: 'withdrawList' })
    withdrawList: WithdrawList;
}
