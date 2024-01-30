import { Inject, Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';

import { Web3Service } from 'src/api/web3/service/web3.service';
import { UpbitService } from 'src/api/upbit/service/upbit.service';

import { AdjustTotalSupplyReqDTO } from 'src/api/web3/dto/web3.req.dto';
import { GetTotalSupplyResDTO } from 'src/api/web3/dto/web3.res.dto';
import { GetKrwAmountResDTO } from 'src/api/upbit/dto/upbit.res.dto';
import { plainToInstance } from 'class-transformer';
import { CustomLogger } from 'src/config/logger/custom.logger.config';

@Injectable()
export class Web3Scheduler {
    constructor(
        @Inject('CROFFLE_BLOCKCHAIN_SERVER_LOG')
        private readonly logger: CustomLogger,
        private readonly upbitService: UpbitService,
        private readonly web3Service: Web3Service,
    ) {}

    private isRunning = false;

    // CFL 발행량 관리 스케줄러
    // @Cron('*/3 * * * * *')
    public async checkAmount() {
        if (this.isRunning) return;

        try {
            this.isRunning = true;

            const getKrwAmountResDTO: GetKrwAmountResDTO = await this.upbitService.getKrwAmount();
            const getTotalSupplyResDTO: GetTotalSupplyResDTO = await this.web3Service.getTotalSupply();

            if (getKrwAmountResDTO.amount * 100 > getTotalSupplyResDTO.total_supply) {
                const adjustTotalSupplyReqDTO = plainToInstance(AdjustTotalSupplyReqDTO, { amount: getKrwAmountResDTO.amount * 100 - getTotalSupplyResDTO.total_supply, increase: true }, { exposeUnsetFields: false });
                await this.web3Service.adjustTotalSupply(adjustTotalSupplyReqDTO);
            } else if (getKrwAmountResDTO.amount * 100 < getTotalSupplyResDTO.total_supply) {
                const adjustTotalSupplyReqDTO = plainToInstance(AdjustTotalSupplyReqDTO, { amount: getTotalSupplyResDTO.total_supply - getKrwAmountResDTO.amount * 100, increase: false }, { exposeUnsetFields: false });
                await this.web3Service.adjustTotalSupply(adjustTotalSupplyReqDTO);
            }
        } catch (error) {
            this.logger.logError(this.constructor.name, this.checkAmount.name, error);
            throw error;
        } finally {
            this.isRunning = false;
        }
    }
}
