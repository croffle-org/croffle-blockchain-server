import { Injectable } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { AccountWalletRepository } from 'src/api/accounts/repository/accounts.repository';
import { AccountWallet } from 'src/model/entity/account-wallet.entity';
import { DepositList } from 'src/model/entity/deposit-list.entity';

import { plainToInstance } from 'class-transformer';

import { GetAccountWalletByUpbitAddressReqDTO, GetCroffleAddressReqDTO, GetWalletInfoReqDTO } from 'src/api/accounts/dto/accounts.req.dto';
import { GetCroffleAddressResDTO, GetWalletInfoResDTO } from 'src/api/accounts/dto/accounts.res.dto';

@Injectable()
export class AccountsService {
    constructor(
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
        const walletInfo: AccountWallet = await this.accountWallet.getWalletInfoByAddressAndCurrency(getWalletInfoReqDTO);
        return plainToInstance(GetWalletInfoResDTO, { walletInfo }, { exposeUnsetFields: false });
    }

    // TODO : 예외처리 코드 수정
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
        const instances: DepositList[] = [];

        for (const deposit of getCroffleAddressReqDTO.depositList) {
            try {
                const getAccountWalletByUpbitAddressReqDTO = plainToInstance(GetAccountWalletByUpbitAddressReqDTO, { upbit_address: deposit.upbit_address }, { exposeUnsetFields: false });
                const instance: AccountWallet = await this.accountWallet.getAccountWalletByUpbitAddress(getAccountWalletByUpbitAddressReqDTO);

                if (instance) {
                    instances.push(plainToInstance(DepositList, { ...deposit, croffle_address: instance.croffle_address }, { exposeUnsetFields: false }));
                } else {
                    throw new Error('등록되지 않은 업비트 주소입니다.');
                }
            } catch (error) {
                console.error(error.message);
            }
        }

        if (instances.length === 0) {
            throw new Error('No valid instances found.');
        }

        return plainToInstance(GetCroffleAddressResDTO, { depositsListWithCroffleAddress: instances }, { exposeUnsetFields: false });
    }
}
