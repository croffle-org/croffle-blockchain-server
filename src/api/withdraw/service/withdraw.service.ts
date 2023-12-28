import { Injectable } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';

import { WithdrawListRepository } from 'src/api/withdraw/repository/withdraw.repository';
import { GetTotalWithdrawAmountForTokensReqDTO, InsertRefundInformationReqDTO } from 'src/api/withdraw/dto/withdraw.req.dto';

@Injectable()
export class WithdrawService {
    constructor(
        @InjectRepository(WithdrawListRepository)
        private readonly withdrawListRepo: WithdrawListRepository,
    ) {}

    /**
     * Retrieves the total withdrawal amount of tokens for a specified address and currency.
     *
     * @param {GetTotalWithdrawAmountForTokensReqDTO} getTotalWithdrawAmountForTokensReqDTO - The details required to fetch the total withdrawal amount.
     * @param {string} GetTotalWithdrawAmountForTokensReqDTO.croffle_address - The address of the Croffle account to retrieve the total withdrawal amount for.
     * @param {CURRENCY} GetTotalWithdrawAmountForTokensReqDTO.currency - The type of currency to retrieve the total withdrawal amount for.
     */
    public async getTotalWithdrawAmountForTokens(getTotalWithdrawAmountForTokensReqDTO: GetTotalWithdrawAmountForTokensReqDTO) {
        return await this.withdrawListRepo.getTotalWithdrawTokenAmountByCurrencyAndAddress(getTotalWithdrawAmountForTokensReqDTO);
    }

    /**
     * Inserts refund information into the withdrawal list.
     *
     * @param {InsertRefundInformationReqDTO} insertRefundInformationReqDTO - The details required to insert the refund information.
     * @param {WithdrawList} InsertRefundInformationReqDTO.withdrawList - The list of withdrawal details to be inserted into the repository.
     */
    public async insertRefundInformation(insertRefundInformationReqDTO: InsertRefundInformationReqDTO): Promise<void> {
        await this.withdrawListRepo.insertWithdrawList(insertRefundInformationReqDTO);
    }
}
