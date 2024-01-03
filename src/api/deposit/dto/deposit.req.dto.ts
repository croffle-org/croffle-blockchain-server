import { Expose, Type } from 'class-transformer';
import { IsArray, IsEnum, IsNumber, IsString, ValidateNested } from 'class-validator';
import { CURRENCY } from 'src/common/const/enum.const';

import { DepositList } from 'src/model/entity/deposit-list.entity';

import { GetDepositTransactionIdsResDTO } from 'src/api/deposit/dto/deposit.res.dto';

export class StoreDepositListReqDTO {
    @Expose({ name: 'depositList' })
    @ValidateNested({ each: true })
    @Type(() => DepositList)
    @IsArray()
    depositList: DepositList[];

    @Expose({ name: 'maticPrice' })
    @IsNumber()
    maticPrice: number;
}

export class RemoveDuplicateTransactionIdsReqDTO extends GetDepositTransactionIdsResDTO {
    @Expose({ name: 'depositList' })
    @ValidateNested({ each: true })
    @Type(() => DepositList)
    @IsArray()
    depositList: DepositList[];
}

export class GetTotalDepositAmountForTokensReqDTO {
    @Expose({ name: 'croffle_address' })
    @IsString()
    croffle_address: string;

    @Expose({ name: 'currency' })
    @IsEnum(CURRENCY)
    currency: CURRENCY;
}

export class UpdateDepositStatusReqDTO {
    @Expose({ name: 'sq' })
    @IsNumber()
    sq: number;
}
