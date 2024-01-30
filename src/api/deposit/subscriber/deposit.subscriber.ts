/* eslint-disable @typescript-eslint/ban-types */
import { Connection, EntitySubscriberInterface, EventSubscriber } from 'typeorm';
import { DepositList } from 'src/model/entity/deposit-list.entity';

import { DepositService } from 'src/api/deposit/service/deposit.service';
import { Web3Service } from 'src/api/web3/service/web3.service';

import { plainToInstance } from 'class-transformer';
import { UpdateDepositStatusReqDTO } from 'src/api/deposit/dto/deposit.req.dto';
import { GetPendingDepositsResDTO } from 'src/api/deposit/dto/deposit.res.dto';
import { TransferToUserReqDTO } from 'src/api/web3/dto/web3.req.dto';
import { CustomLogger } from 'src/config/logger/custom.logger.config';
import { Inject } from '@nestjs/common';

@EventSubscriber()
export class DepositListSubscriber implements EntitySubscriberInterface<DepositList> {
    constructor(
        @Inject('CROFFLE_BLOCKCHAIN_SERVER_LOG')
        private readonly logger: CustomLogger,
        private connection: Connection,
        private readonly depositService: DepositService,
        private readonly web3Service: Web3Service,
    ) {
        this.connection.subscribers.push(this);
    }

    listenTo(): ReturnType<EntitySubscriberInterface['listenTo']> {
        return DepositList;
    }

    async afterInsert(): Promise<void> {
        try {
            const getPendingDepositsResDTO: GetPendingDepositsResDTO = await this.depositService.getPendingDeposits();
            if (getPendingDepositsResDTO.pendingDepositList.length === 0) return;

            for (const deposit of getPendingDepositsResDTO.pendingDepositList) {
                const transferToUserReqDTO = plainToInstance(TransferToUserReqDTO, { deposit }, { exposeUnsetFields: false });
                await this.web3Service.transferToUser(transferToUserReqDTO);

                const updateDepositStatusReqDTO = plainToInstance(UpdateDepositStatusReqDTO, { sq: deposit.sq }, { exposeUnsetFields: false });
                await this.depositService.updateDepositStatus(updateDepositStatusReqDTO);
            }
        } catch (error) {
            this.logger.logError(this.constructor.name, this.afterInsert.name, error);
            throw error;
        }
    }
}
