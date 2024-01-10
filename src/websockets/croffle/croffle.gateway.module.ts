import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';

import { TypeOrmModule } from '@nestjs/typeorm';
import { DepositList } from 'src/model/entity/deposit-list.entity';
import { WithdrawList } from 'src/model/entity/withdraw-list.entity';
import { AccountWallet } from 'src/model/entity/account-wallet.entity';

import { CacheModule } from '@nestjs/cache-manager';
import { CacheConfig } from 'src/config/cache/cache.config';

import { AccountsModule } from 'src/api/accounts/accounts.module';
import { DepositModule } from 'src/api/deposit/deposit.module';
import { OrderModule } from 'src/api/order/order.module';
import { OrderPayModule } from 'src/api/orderPay/orderPay.module';
import { WithdrawModule } from 'src/api/withdraw/withdraw.module';
import { UpbitModule } from 'src/api/upbit/upbit.module';
import { Web3Module } from 'src/api/web3/web3.module';

import { CroffleGateway } from 'src/websockets/croffle/gateway/croffle.gateway';

import { AxiosHelper } from 'src/helper/axios/axios.helper';
import { PayModule } from 'src/api/pay/pay.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([DepositList, WithdrawList, AccountWallet]),
        HttpModule.register({ timeout: 10000, maxRedirects: 3 }),
        CacheModule.register({ useClass: CacheConfig }),
        AccountsModule,
        DepositModule,
        OrderModule,
        OrderPayModule,
        PayModule,
        WithdrawModule,
        UpbitModule,
        Web3Module,
    ],
    providers: [AxiosHelper, CroffleGateway],
})
export class CroffleGatewayModule {}
