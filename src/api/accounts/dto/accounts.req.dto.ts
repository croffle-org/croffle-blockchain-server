import { Expose } from 'class-transformer';
import { IsArray, IsEnum, IsString } from 'class-validator';
import { CURRENCY } from 'src/common/const/enum.const';
import { DepositList } from 'src/model/entity/deposit-list.entity';

export class GetWalletInfoReqDTO {
    @Expose({ name: 'croffle_address' })
    @IsString()
    croffle_address: string;

    @Expose({ name: 'currency' })
    @IsEnum(CURRENCY)
    currency: CURRENCY;
}

export class GetCroffleAddressReqDTO {
    @Expose({ name: 'depositList' })
    @IsArray()
    depositList: DepositList[];
}

export class GetAccountWalletByUpbitAddressReqDTO {
    @Expose({ name: 'upbit_address' })
    @IsString()
    upbit_address: string;
}
