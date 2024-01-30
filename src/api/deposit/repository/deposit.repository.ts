import { Inject, Injectable } from '@nestjs/common';

import { DataSource, Repository } from 'typeorm';
import { DepositList } from 'src/model/entity/deposit-list.entity';

import { ResImpl } from 'src/common/res/res.implement';
import { INSERT_FAILED, SELECT_FAILED, UPDATE_FAILED } from 'src/common/const/error.const';

import { GetTotalDepositAmountForTokensReqDTO, StoreDepositListReqDTO, UpdateDepositStatusReqDTO } from 'src/api/deposit/dto/deposit.req.dto';
import { CustomLogger } from 'src/config/logger/custom.logger.config';

@Injectable()
export class DepositListRepository extends Repository<DepositList> {
    constructor(
        @Inject('CROFFLE_BLOCKCHAIN_SERVER_LOG')
        private readonly logger: CustomLogger,
        private dataSource: DataSource,
    ) {
        super(DepositList, dataSource.createEntityManager());
    }

    public async storeDepositList(storeDepositListReqDTO: StoreDepositListReqDTO): Promise<void> {
        try {
            await this.createQueryBuilder().insert().into(DepositList).values(storeDepositListReqDTO.depositList).orIgnore().updateEntity(false).execute();
        } catch (error) {
            this.logger.logError(this.constructor.name, this.storeDepositList.name, error);
            throw new ResImpl(INSERT_FAILED);
        }
    }

    public async getPendingDeposits(): Promise<DepositList[]> {
        try {
            return await this.find({
                where: {
                    status: false,
                },
            });
        } catch (error) {
            this.logger.logError(this.constructor.name, this.getPendingDeposits.name, error);
            throw new ResImpl(SELECT_FAILED);
        }
    }

    public async getPendingDepositTransactionIds(): Promise<DepositList[]> {
        try {
            return await this.find({
                where: {
                    status: false,
                },
                select: {
                    txid: true,
                },
            });
        } catch (error) {
            this.logger.logError(this.constructor.name, this.getPendingDepositTransactionIds.name, error);
            throw new ResImpl(SELECT_FAILED);
        }
    }

    public async getTotalDepositAmountForTokensByAddress(getTotalDepositAmountForTokensReqDTO: GetTotalDepositAmountForTokensReqDTO): Promise<any> {
        try {
            return await this.createQueryBuilder('depositList')
                .where('depositList.currency = :currency', { currency: getTotalDepositAmountForTokensReqDTO.currency })
                .andWhere('depositList.croffle_address = :croffle_address', { croffle_address: getTotalDepositAmountForTokensReqDTO.croffle_address })
                .select('SUM(depositList.amount)', 'totalTokenAmount')
                .addSelect('SUM(depositList.krw_amount)', 'totalAmount')
                .getRawOne();
        } catch (error) {
            this.logger.logError(this.constructor.name, this.getTotalDepositAmountForTokensByAddress.name, error);
            throw new ResImpl(SELECT_FAILED);
        }
    }

    public async updateDepositStatus(updateDepositStatusReqDTO: UpdateDepositStatusReqDTO): Promise<void> {
        try {
            await this.update(updateDepositStatusReqDTO.sq, {
                status: true,
            });
        } catch (error) {
            this.logger.logError(this.constructor.name, this.updateDepositStatus.name, error);
            throw new ResImpl(UPDATE_FAILED);
        }
    }
}
