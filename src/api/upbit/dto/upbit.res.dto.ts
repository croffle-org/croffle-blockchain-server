import { Expose } from 'class-transformer';
import { IsArray, IsNumber, IsString } from 'class-validator';

import { DepositList } from 'src/model/entity/deposit-list.entity';

export class SetUpbitJwtResDTO {
    @Expose({ name: 'token' })
    @IsString()
    token: string;
}

export class GetKrwAmountResDTO {
    @Expose({ name: 'amount' })
    @IsNumber()
    amount: number;
}

export class GetMaticPriceResDTO {
    @Expose({ name: 'token_price' })
    @IsNumber()
    token_price: number;
}

export class GetTransactionFromAddressResDTO {
    @Expose({ name: 'depositsListWithFromAddress' })
    @IsArray()
    depositsListWithFromAddress: DepositList[];
}

export class GetRecentUpbitMaticDepositsResDTO {
    @Expose({ name: 'recentDepositList' })
    @IsArray()
    recentDepositList: DepositList[];
}
