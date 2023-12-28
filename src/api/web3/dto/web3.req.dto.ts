import { Expose } from 'class-transformer';
import { IsBoolean, IsNumber, IsString } from 'class-validator';

import { DepositList } from 'src/model/entity/deposit-list.entity';

export class AdjustTotalSupplyReqDTO {
    @Expose({ name: 'amount' })
    @IsNumber()
    amount: number;

    @Expose({ name: 'increase' })
    @IsBoolean()
    increase: boolean;
}

export class TransferToUserReqDTO {
    @Expose({ name: 'deposit' })
    deposit: DepositList;
}

export class TransferToTotalSupplyManagerReqDTO {
    @Expose({ name: 'amount' })
    @IsString()
    amount: string;
}
