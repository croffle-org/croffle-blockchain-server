import { Module, forwardRef } from '@nestjs/common';

import { TypeOrmModule } from '@nestjs/typeorm';
import { DepositList } from 'src/model/entity/deposit-list.entity';
import { AccountWallet } from 'src/model/entity/account-wallet.entity';

import { CacheModule } from '@nestjs/cache-manager';
import { CacheConfig } from 'src/config/cache/cache.config';

import { DepositModule } from 'src/api/deposit/deposit.module';
import { UpbitModule } from 'src/api/upbit/upbit.module';

import { Web3Service } from 'src/api/web3/service/web3.service';
import { Web3Scheduler } from 'src/api/web3/scheduler/web3.scheduler';

import { EthersHelper } from 'src/helper/ethers/ethers.helper';

@Module({
    imports: [TypeOrmModule.forFeature([DepositList, AccountWallet]), CacheModule.register({ useClass: CacheConfig }), forwardRef(() => DepositModule), UpbitModule],
    providers: [Web3Service, Web3Scheduler, EthersHelper],
    exports: [Web3Service],
})
export class Web3Module {}
