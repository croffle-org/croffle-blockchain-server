import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';

import { Web3Service } from 'src/api/web3/service/web3.service';
import { UpbitService } from 'src/api/upbit/service/upbit.service';

import { AdjustTotalSupplyReqDTO } from 'src/api/web3/dto/web3.req.dto';
import { GetTotalSupplyResDTO } from 'src/api/web3/dto/web3.res.dto';
import { GetKrwAmountResDTO } from 'src/api/upbit/dto/upbit.res.dto';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class Web3Scheduler {
    constructor(private readonly upbitService: UpbitService, private readonly web3Service: Web3Service) {}

    private isRunning = false;

    @Cron('*/3 * * * * *')
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
            console.error(error.message);
        } finally {
            this.isRunning = false;
        }
    }
}
