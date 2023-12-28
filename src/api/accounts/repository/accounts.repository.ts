import { Injectable } from '@nestjs/common';

import { DataSource, Repository } from 'typeorm';
import { AccountWallet } from 'src/model/entity/account-wallet.entity';

import { ResImpl } from 'src/common/res/res.implement';
import { SELECT_FAILED } from 'src/common/const/error.const';

import { GetAccountWalletByUpbitAddressReqDTO, GetWalletInfoReqDTO } from 'src/api/accounts/dto/accounts.req.dto';

@Injectable()
export class AccountWalletRepository extends Repository<AccountWallet> {
    constructor(private dataSource: DataSource) {
        super(AccountWallet, dataSource.createEntityManager());
    }

    public async getAccountWalletByUpbitAddress(getAccountWalletByUpbitAddressReqDTO: GetAccountWalletByUpbitAddressReqDTO): Promise<AccountWallet> {
        try {
            return await this.findOne({
                where: {
                    upbit_address: getAccountWalletByUpbitAddressReqDTO.upbit_address,
                },
            });
        } catch (error) {
            console.error(error.message);
            throw new ResImpl(SELECT_FAILED);
        }
    }

    public async getWalletInfoByAddressAndCurrency(getWalletInfoReqDTO: GetWalletInfoReqDTO): Promise<AccountWallet> {
        try {
            const instance = await this.findOne({
                where: { croffle_address: getWalletInfoReqDTO.croffle_address, currency: getWalletInfoReqDTO.currency },
            });

            return instance;
        } catch (error) {
            console.error(error.message);
            throw new ResImpl(SELECT_FAILED);
        }
    }
}
