import { Inject, Injectable } from '@nestjs/common';

import { DataSource, Repository } from 'typeorm';
import { AccountWallet } from 'src/model/entity/account-wallet.entity';

import { ResImpl } from 'src/common/res/res.implement';
import { SELECT_FAILED } from 'src/common/const/error.const';

import { GetAccountWalletByUpbitAddressReqDTO, GetWalletInfoReqDTO } from 'src/api/accounts/dto/accounts.req.dto';
import { CustomLogger } from 'src/config/logger/custom.logger.config';

@Injectable()
export class AccountWalletRepository extends Repository<AccountWallet> {
    constructor(
        @Inject('CROFFLE_BLOCKCHAIN_SERVER_LOG')
        private readonly logger: CustomLogger,
        private dataSource: DataSource,
    ) {
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
            this.logger.logError(this.constructor.name, this.getAccountWalletByUpbitAddress.name, error);
            throw new ResImpl(SELECT_FAILED);
        }
    }

    public async getWalletInfoByAddressAndCurrency(getWalletInfoReqDTO: GetWalletInfoReqDTO): Promise<AccountWallet> {
        try {
            return await this.findOne({
                where: { croffle_address: getWalletInfoReqDTO.croffle_address, currency: getWalletInfoReqDTO.currency },
            });
        } catch (error) {
            this.logger.logError(this.constructor.name, this.getWalletInfoByAddressAndCurrency.name, error);
            throw new ResImpl(SELECT_FAILED);
        }
    }
}
