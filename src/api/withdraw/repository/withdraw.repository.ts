import { Inject, Injectable } from '@nestjs/common';

import { CustomLogger } from 'src/config/logger/custom.logger.config';

import { DataSource, Repository } from 'typeorm';
import { WithdrawList } from 'src/model/entity/withdraw-list.entity';

import { ResImpl } from 'src/common/res/res.implement';
import { INSERT_FAILED, SELECT_FAILED } from 'src/common/const/error.const';

import { GetTotalWithdrawAmountForTokensReqDTO, InsertRefundInformationReqDTO } from 'src/api/withdraw/dto/withdraw.req.dto';

@Injectable()
export class WithdrawListRepository extends Repository<WithdrawList> {
    constructor(
        @Inject('CROFFLE_BLOCKCHAIN_SERVER_LOG')
        private readonly logger: CustomLogger,
        private dataSource: DataSource,
    ) {
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
            this.logger.logError(this.constructor.name, this.getTotalWithdrawTokenAmountByCurrencyAndAddress.name, error);
            throw new ResImpl(SELECT_FAILED);
        }
    }

    public async insertWithdrawList(insertRefundInformationReqDTO: InsertRefundInformationReqDTO): Promise<void> {
        try {
            await this.insert(insertRefundInformationReqDTO.withdrawList);
        } catch (error) {
            this.logger.logError(this.constructor.name, this.insertWithdrawList.name, error);
            throw new ResImpl(INSERT_FAILED);
        }
    }
}
