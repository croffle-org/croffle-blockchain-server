import { Injectable } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { DepositListRepository } from 'src/api/deposit/repository/deposit.repository';
import { DepositList } from 'src/model/entity/deposit-list.entity';

import { plainToInstance } from 'class-transformer';

import { GetTotalDepositAmountForTokensReqDTO, RemoveDuplicateTransactionIdsReqDTO, StoreDepositListReqDTO, UpdateDepositStatusReqDTO } from 'src/api/deposit/dto/deposit.req.dto';
import { GetDepositTransactionIdsResDTO, GetPendingDepositsResDTO, RemoveDuplicateTransactionIdsResDTO } from 'src/api/deposit/dto/deposit.res.dto';

@Injectable()
export class DepositService {
    constructor(
        @InjectRepository(DepositListRepository)
        private readonly depositList: DepositListRepository,
    ) {}

    /**
     * @dev Stores a list of deposits, mapping each deposit with the given matic price.
     *
     * @param {StoreDepositListReqDTO} storeDepositListReqDTO
     * @param {DepositList[]} storeDepositListReqDTO.depositList - An array of deposits to store. Each deposit contains details like the amount and address.
     * @param {number} storeDepositListReqDTO.maticPrice - The current price of Matic in KRW.
     */
    public async storeDepositList(storeDepositListReqDTO: StoreDepositListReqDTO): Promise<void> {
        storeDepositListReqDTO.depositList = storeDepositListReqDTO.depositList.map((deposit) =>
            plainToInstance(DepositList, { ...deposit, krw_amount: Number(deposit.amount) * storeDepositListReqDTO.maticPrice, token_price: storeDepositListReqDTO.maticPrice }, { exposeUnsetFields: false }),
        );

        await this.depositList.storeDepositList(storeDepositListReqDTO);
    }

    /**
     * @dev Retrieves a list of deposits that are currently in a pending state.
     *
     * @returns {Promise<GetPendingDepositsResDTO>} Returns an object containing the list of pending deposits.
     * @returns {DepositList[]} GetPendingDepositsResDTO.pendingDepositList - List of deposits that are currently pending.
     */
    public async getPendingDeposits(): Promise<GetPendingDepositsResDTO> {
        const pendingDepositList: DepositList[] = await this.depositList.getPendingDeposits();
        return plainToInstance(GetPendingDepositsResDTO, { pendingDepositList }, { exposeUnsetFields: false });
    }

    /**
     * @dev Retrieves a list of transaction IDs for deposits that are currently pending.
     *
     * @returns {GetDepositTransactionIdsResDTO} A data transfer object containing an array of pending deposit transaction IDs.
     * @returns {string[]} GetDepositTransactionIdsResDTO.transactionsIds - An array of strings, each representing a transaction ID of a pending deposit.
     */
    public async getDepositTransactionIds(): Promise<GetDepositTransactionIdsResDTO> {
        const depositTransactionIds: DepositList[] = await this.depositList.getPendingDepositTransactionIds();

        return plainToInstance(GetDepositTransactionIdsResDTO, { depositTransactionIds }, { exposeUnsetFields: false });
    }

    /**
     * @dev Filters out deposit records that have transaction IDs found in the provided list of transaction IDs. This is used to remove duplicates.
     *
     * @param {RemoveDuplicateTransactionIdsReqDTO} removeDuplicateTransactionIdsReqDTO
     * @param {DepositList[]} removeDuplicateTransactionIdsReqDTO.depositList - An array of deposit records to be filtered.
     * @param {string[]} removeDuplicateTransactionIdsReqDTO.transactionsIds - An array of transaction IDs to check against for duplicates.
     *
     * @returns {Promise<RemoveDuplicateTransactionIdsResDTO>} Returns an object containing the filtered list of deposits without duplicate transaction IDs.
     * @returns {DepositList[]} RemoveDuplicateTransactionIdsResDTO.filterDepositList - List of deposits after removing ones with duplicate transaction IDs.
     */
    public async removeDuplicateTransactionIds(removeDuplicateTransactionIdsReqDTO: RemoveDuplicateTransactionIdsReqDTO): Promise<RemoveDuplicateTransactionIdsResDTO> {
        try {
            const filterDepositList: DepositList[] = [];

            for (let i = 0; i < removeDuplicateTransactionIdsReqDTO.depositList.length; i++) {
                let isDuplicate = false;

                for (let j = 0; j < removeDuplicateTransactionIdsReqDTO.transactionsIds.length; j++) {
                    if (removeDuplicateTransactionIdsReqDTO.depositList[i].txid === removeDuplicateTransactionIdsReqDTO.transactionsIds[j]) {
                        isDuplicate = true;
                        break;
                    }
                }

                if (!isDuplicate) {
                    filterDepositList.push(removeDuplicateTransactionIdsReqDTO.depositList[i]);
                }
            }

            return plainToInstance(RemoveDuplicateTransactionIdsResDTO, { filterDepositList }, { exposeUnsetFields: false });
        } catch (error) {
            console.error(error.message);
            throw new Error('failed to get deposit list transaction ids.');
        }
    }

    // TODO : return 값 추가
    /**
     * @dev Retrieves the total deposit amount for tokens associated with a specific Croffle address and currency.
     *
     * @param {GetTotalDepositAmountForTokensReqDTO} getTotalDepositAmountForTokensReqDTO
     * @param {string} getTotalDepositAmountForTokensReqDTO.croffle_address - The Croffle address to be used for fetching the total deposit amount.
     * @param {CURRENCY} getTotalDepositAmountForTokensReqDTO.currency - The currency type associated with the deposits.
     *
     * @returns ???
     */
    public async getTotalDepositAmountForTokens(getTotalDepositAmountForTokensReqDTO: GetTotalDepositAmountForTokensReqDTO) {
        return await this.depositList.getTotalDepositAmountForTokensByAddress(getTotalDepositAmountForTokensReqDTO);
    }

    /**
     * @dev Updates the status of a deposit based on the provided deposit sequence number (sq).
     *
     * @param {UpdateDepositStatusReqDTO} updateDepositStatusReqDTO
     * @param {number} updateDepositStatusReqDTO.sq - The sequence number of the deposit to be updated.
     */
    public async updateDepositStatus(updateDepositStatusReqDTO: UpdateDepositStatusReqDTO): Promise<void> {
        await this.depositList.updateDepositStatus(updateDepositStatusReqDTO);
    }
}
