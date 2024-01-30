import { Module } from '@nestjs/common';

import { CustomLoggerModule } from 'src/module/custom.logger.module';

import { TypeOrmModule } from '@nestjs/typeorm';
import { DepositList } from 'src/model/entity/deposit-list.entity';
import { AccountWallet } from 'src/model/entity/account-wallet.entity';

import { Web3Module } from '../web3/web3.module';

import { DepositService } from 'src/api/deposit/service/deposit.service';
import { DepositListRepository } from 'src/api/deposit/repository/deposit.repository';
import { DepositListSubscriber } from 'src/api/deposit/subscriber/deposit.subscriber';

@Module({
    imports: [CustomLoggerModule, TypeOrmModule.forFeature([AccountWallet, DepositList]), Web3Module],
    providers: [DepositService, DepositListRepository, DepositListSubscriber],
    exports: [DepositService],
})
export class DepositModule {}
