import { Injectable } from '@nestjs/common';

import { DataSource, Repository } from 'typeorm';
import { WithdrawList } from 'src/model/entity/withdraw-list.entity';

import { ResImpl } from 'src/common/res/res.implement';
import { INSERT_FAILED, SELECT_FAILED } from 'src/common/const/error.const';

import { GetTotalWithdrawAmountForTokensReqDTO, InsertRefundInformationReqDTO } from 'src/api/withdraw/dto/withdraw.req.dto';

@Injectable()
export class WithdrawListRepository extends Repository<WithdrawList> {
    constructor(private dataSource: DataSource) {
        super(WithdrawList, dataSource.createEntityManager());
    }

    public async getTotalWithdrawTokenAmountByCurrencyAndAddress(getTotalWithdrawAmountForTokensReqDTO: GetTotalWithdrawAmountForTokensReqDTO) {
        try {
            return await this.createQueryBuilder('withdrawList')
                .where('withdrawList.currency = :currency', { currency: getTotalWithdrawAmountForTokensReqDTO.currency })
                .andWhere('withdrawList.croffle_address = :croffle_address', { croffle_address: getTotalWithdrawAmountForTokensReqDTO.croffle_address })
                .select('SUM(withdrawList.amount)', 'totalAmount')
                .addSelect('SUM(withdrawList.token_amount)', 'totalTokenAmount')
                .getRawOne();
        } catch (error) {
            console.error(error.message);
            throw new ResImpl(SELECT_FAILED);
        }
    }

    public async insertWithdrawList(insertRefundInformationReqDTO: InsertRefundInformationReqDTO): Promise<void> {
        try {
            await this.insert(insertRefundInformationReqDTO.withdrawList);
        } catch (error) {
            console.error(error.message);
            throw new ResImpl(INSERT_FAILED);
        }
    }
}
