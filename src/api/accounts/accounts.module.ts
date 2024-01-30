import { Module } from '@nestjs/common';

import { CustomLoggerModule } from 'src/module/custom.logger.module';

import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountWallet } from 'src/model/entity/account-wallet.entity';

import { AccountsService } from 'src/api/accounts/service/accounts.service';
import { AccountWalletRepository } from './repository/accounts.repository';

@Module({
    imports: [CustomLoggerModule, TypeOrmModule.forFeature([AccountWallet])],
    providers: [AccountsService, AccountWalletRepository],
    exports: [AccountsService],
})
export class AccountsModule {}
