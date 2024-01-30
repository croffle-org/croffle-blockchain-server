import { Module, forwardRef } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';

import { CustomLoggerModule } from 'src/module/custom.logger.module';

import { TypeOrmModule } from '@nestjs/typeorm';
import { DepositList } from 'src/model/entity/deposit-list.entity';
import { AccountWallet } from 'src/model/entity/account-wallet.entity';

import { CacheModule } from '@nestjs/cache-manager';
import { CacheConfig } from 'src/config/cache/cache.config';

import { DepositModule } from 'src/api/deposit/deposit.module';
import { Web3Module } from 'src/api/web3/web3.module';
import { AccountsModule } from 'src/api/accounts/accounts.module';

import { UpbitController } from 'src/api/upbit/controller/upbit.controller';
import { UpbitService } from 'src/api/upbit/service/upbit.service';
import { UpbitScheduler } from 'src/api/upbit/scheduler/upbit.scheduler';

import { AxiosHelper } from 'src/helper/axios/axios.helper';

@Module({
    imports: [
        CustomLoggerModule,
        TypeOrmModule.forFeature([DepositList, AccountWallet]),
        HttpModule.register({ timeout: 10000, maxRedirects: 5 }),
        CacheModule.register({ useClass: CacheConfig }),
        forwardRef(() => DepositModule),
        forwardRef(() => Web3Module),
        AccountsModule,
    ],
    controllers: [UpbitController],
    providers: [UpbitService, AxiosHelper, UpbitScheduler],
    exports: [UpbitService],
})
export class UpbitModule {}
