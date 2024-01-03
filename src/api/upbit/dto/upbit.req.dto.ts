import { Expose, Type } from 'class-transformer';
import { IsArray, IsEnum, IsString, ValidateNested } from 'class-validator';

import { DepositList } from 'src/model/entity/deposit-list.entity';
import { CURRENCY } from 'src/common/const/enum.const';

export class SetUpbitJwtReqDTO {
    @Expose({ name: 'token' })
    @IsString()
    token: string;
}

export class GetTransactionFromAddressReqDTO {
    @Expose({ name: 'depositList' })
    @ValidateNested({ each: true })
    @Type(() => DepositList)
    @IsArray()
    depositList: DepositList[];
}

export class WithdrawReqDTO {
    @Expose({ name: 'currency' })
    @IsEnum(CURRENCY)
    currency: CURRENCY;

    @Expose({ name: 'amount' })
    @IsString()
    amount: string;

    @Expose({ name: 'address' })
    @IsString()
    address: string;
}
