import { Module } from '@nestjs/common';

import { TypeOrmModule } from '@nestjs/typeorm';
import { WithdrawList } from 'src/model/entity/withdraw-list.entity';

import { WithdrawService } from 'src/api/withdraw/service/withdraw.service';
import { WithdrawListRepository } from 'src/api/withdraw/repository/withdraw.repository';

@Module({
    imports: [TypeOrmModule.forFeature([WithdrawList])],
    providers: [WithdrawService, WithdrawListRepository],
    exports: [WithdrawService],
})
export class WithdrawModule {}
