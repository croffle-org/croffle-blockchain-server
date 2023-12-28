import { Module } from '@nestjs/common';

import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountWallet } from 'src/model/entity/account-wallet.entity';

import { AccountsService } from 'src/api/accounts/service/accounts.service';
import { AccountWalletRepository } from './repository/accounts.repository';

@Module({
    imports: [TypeOrmModule.forFeature([AccountWallet])],
    providers: [AccountsService, AccountWalletRepository],
    exports: [AccountsService],
})
export class AccountsModule {}
