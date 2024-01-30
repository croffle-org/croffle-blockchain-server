import { Expose } from 'class-transformer';
import { IsArray, IsNumber } from 'class-validator';

import { DepositList } from 'src/model/entity/deposit-list.entity';

export class getPendingDepositTransactionIdsResDTO {
    @Expose({ name: 'transactionsIds' })
    @IsArray()
    transactionsIds: string[];
}

export class GetPendingDepositsResDTO {
    @Expose({ name: 'pendingDepositList' })
    @IsArray()
    pendingDepositList: DepositList[];
}

export class RemoveDuplicateTransactionIdsResDTO {
    @Expose({ name: 'filterDepositList' })
    @IsArray()
    filterDepositList: DepositList[];
}

export class GetTotalDepositAmountForTokensResDTO {
    @Expose({ name: 'totalAmount' })
    @IsNumber()
    totalAmount: number;

    @Expose({ name: 'totalTokenAmount' })
    @IsNumber()
    totalTokenAmount: number;
}
