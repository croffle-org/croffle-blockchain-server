import { Inject, Injectable } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { AccountWalletRepository } from 'src/api/accounts/repository/accounts.repository';
import { AccountWallet } from 'src/model/entity/account-wallet.entity';
import { DepositList } from 'src/model/entity/deposit-list.entity';

import { plainToInstance } from 'class-transformer';

import { GetCroffleAddressReqDTO, GetWalletInfoReqDTO } from 'src/api/accounts/dto/accounts.req.dto';
import { GetCroffleAddressResDTO, GetWalletInfoResDTO } from 'src/api/accounts/dto/accounts.res.dto';
import { CustomLogger } from 'src/config/logger/custom.logger.config';

@Injectable()
export class AccountsService {
    constructor(
        @Inject('CROFFLE_BLOCKCHAIN_SERVER_LOG')
        private readonly logger: CustomLogger,
        @InjectRepository(AccountWalletRepository)
        private readonly accountWallet: AccountWalletRepository,
    ) {}

    /**
     * @dev Retrieves user information based on the provided Croffle wallet address and currency.
     *
     * @param {GetWalletInfoReqDTO} getWalletInfoReqDTO
     * @param {string} getWalletInfoReqDTO.croffle_address - The Croffle wallet address of the user.
     * @param {enum} getWalletInfoReqDTO.currency - The currency type associated with the wallet (e.g., 'BTC', 'ETH').
     *
     * @returns {Promise<GetWalletInfoResDTO>} Returns an object containing the fetched wallet information.
     * @returns {AccountWallet} GetWalletInfoResDTO.walletInfo - Detailed information of the user's wallet.
     */
    public async getWalletInfo(getWalletInfoReqDTO: GetWalletInfoReqDTO): Promise<GetWalletInfoResDTO> {
        this.logger.logMethodEntry(this.constructor.name, this.getWalletInfo.name, getWalletInfoReqDTO);
        try {
            const walletInfo: AccountWallet = await this.accountWallet.getWalletInfoByAddressAndCurrency(getWalletInfoReqDTO);
            return plainToInstance(GetWalletInfoResDTO, { walletInfo }, { exposeUnsetFields: false });
        } catch (error) {
            this.logger.logError(this.constructor.name, this.getWalletInfo.name, error);
            throw error;
        }
    }

    /**
     * @dev Retrieves the associated Croffle address for a given Upbit address from the deposit list.
     *
     * @param {GetCroffleAddressReqDTO} getCroffleAddressReqDTO
     * @param {DepositList[]} getCroffleAddressReqDTO.depositList -  An array of deposit records to process. Each record represents details about a deposit, including the Upbit address.
     *
     * @returns {Promise<GetCroffleAddressResDTO>} Returns an object containing the list of deposits associated with Croffle addresses.
     * @returns {DepositList[]} GetCroffleAddressResDTO.depositsListWithCroffleAddress - List of deposits each with its associated Croffle address.
     */
    public async getCroffleAddress(getCroffleAddressReqDTO: GetCroffleAddressReqDTO): Promise<GetCroffleAddressResDTO> {
        this.logger.logMethodEntry(this.constructor.name, this.getCroffleAddress.name, getCroffleAddressReqDTO);

        const instances: DepositList[] = [];

        try {
            for (const deposit of getCroffleAddressReqDTO.depositList) {
                try {
                    const instance: AccountWallet = await this.accountWallet.getAccountWalletByUpbitAddress({
                        upbit_address: deposit.upbit_address,
                    });
                    if (instance) {
                        instances.push(plainToInstance(DepositList, { ...deposit, croffle_address: instance.croffle_address }, { exposeUnsetFields: false }));
                    }
                } catch (error) {
                    this.logger.logError(this.constructor.name, this.getCroffleAddress.name, error);
                }
            }
            if (instances.length === 0) {
                throw new Error('유효한 크로플 지갑 주소를 찾지 못하였습니다.');
            }
            return plainToInstance(GetCroffleAddressResDTO, { depositsListWithCroffleAddress: instances }, { exposeUnsetFields: false });
        } catch (error) {
            this.logger.logError(this.constructor.name, this.getCroffleAddress.name, error);
            throw error;
        }
    }
}
