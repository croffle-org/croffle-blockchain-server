import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';

import { UpbitService } from 'src/api/upbit/service/upbit.service';
import { Web3Service } from 'src/api/web3/service/web3.service';
import { DepositService } from 'src/api/deposit/service/deposit.service';
import { AccountsService } from 'src/api/accounts/service/accounts.service';

import { plainToInstance } from 'class-transformer';
import { GetTransactionFromAddressReqDTO } from 'src/api/upbit/dto/upbit.req.dto';
import { GetMaticPriceResDTO, GetRecentUpbitMaticDepositsResDTO, GetTransactionFromAddressResDTO } from 'src/api/upbit/dto/upbit.res.dto';
import { RemoveDuplicateTransactionIdsReqDTO, StoreDepositListReqDTO } from 'src/api/deposit/dto/deposit.req.dto';
import { GetDepositTransactionIdsResDTO, RemoveDuplicateTransactionIdsResDTO } from 'src/api/deposit/dto/deposit.res.dto';
import { GetCroffleAddressReqDTO } from 'src/api/accounts/dto/accounts.req.dto';
import { GetCroffleAddressResDTO } from 'src/api/accounts/dto/accounts.res.dto';

@Injectable()
export class UpbitScheduler {
    constructor(private readonly upbitService: UpbitService, private readonly web3Service: Web3Service, private readonly depositService: DepositService, private readonly accountsService: AccountsService) {}

    private storeDepositListIsRunning = false;

    // 업비트 입금 내역을 저장하는 스케줄러
    @Cron('*/3 * * * * *')
    public async storeDepositList() {
        if (this.storeDepositListIsRunning) return;

        try {
            this.storeDepositListIsRunning = true;

            const getRecentUpbitMaticDepositsResDTO: GetRecentUpbitMaticDepositsResDTO = await this.upbitService.getRecentUpbitMaticDeposits();
            if (getRecentUpbitMaticDepositsResDTO.recentDepositList.length === 0) return;

            const getDepositTransactionIdsResDTO: GetDepositTransactionIdsResDTO = await this.depositService.getDepositTransactionIds();
            const removeDuplicateTransactionIdsReqDTO = plainToInstance(
                RemoveDuplicateTransactionIdsReqDTO,
                { depositList: getRecentUpbitMaticDepositsResDTO.recentDepositList, transactionIds: getDepositTransactionIdsResDTO.transactionsIds },
                { exposeUnsetFields: false },
            );

            const removeDuplicateTransactionIdsResDTO: RemoveDuplicateTransactionIdsResDTO = await this.depositService.removeDuplicateTransactionIds(removeDuplicateTransactionIdsReqDTO);
            if (removeDuplicateTransactionIdsResDTO.filterDepositList.length === 0) return;

            const getMaticPriceResDTO: GetMaticPriceResDTO = await this.upbitService.getMaticPrice();

            const getTransactionFromAddressReqDTO = plainToInstance(GetTransactionFromAddressReqDTO, { depositList: removeDuplicateTransactionIdsResDTO.filterDepositList }, { exposeUnsetFields: false });
            const getTransactionFromAddressResDTO: GetTransactionFromAddressResDTO = await this.upbitService.getTransactionFromAddress(getTransactionFromAddressReqDTO);

            const getCroffleAddressReqDTO = plainToInstance(GetCroffleAddressReqDTO, { depositList: getTransactionFromAddressResDTO.depositsListWithFromAddress }, { exposeUnsetFields: false });
            const getCroffleAddressResDTO: GetCroffleAddressResDTO = await this.accountsService.getCroffleAddress(getCroffleAddressReqDTO);

            const storeDepositListReqDTO = plainToInstance(StoreDepositListReqDTO, { depositList: getCroffleAddressResDTO.depositsListWithCroffleAddress, maticPrice: getMaticPriceResDTO.token_price }, { exposeUnsetFields: false });
            await this.depositService.storeDepositList(storeDepositListReqDTO);
        } catch (error) {
            console.error(error.message);
        } finally {
            this.storeDepositListIsRunning = false;
        }
    }
}
