import { Logger, Module } from '@nestjs/common';

import { APP_FILTER } from '@nestjs/core';
import { AllExceptionsFilter } from 'src/filter/common.exception.filter';

import { ScheduleModule } from '@nestjs/schedule';
import { DatabaseModule } from 'src/module/database.module';
import { EnvConfigModule } from 'src/module/env-config.module';

import { AccountsModule } from 'src/api/accounts/accounts.module';
import { DepositModule } from 'src/api/deposit/deposit.module';
import { OrderModule } from 'src/api/order/order.module';
import { OrderPayModule } from 'src/api/orderPay/orderPay.module';
import { PayModule } from 'src/api/pay/pay.module';
import { UpbitModule } from 'src/api/upbit/upbit.module';
import { Web3Module } from 'src/api/web3/web3.module';
import { WithdrawModule } from 'src/api/withdraw/withdraw.module';
import { CroffleGatewayModule } from 'src/websockets/croffle/croffle.gateway.module';

import { HealthController } from 'src/api/health.controller';

@Module({
    imports: [EnvConfigModule, DatabaseModule, ScheduleModule.forRoot(), AccountsModule, DepositModule, OrderModule, OrderPayModule, PayModule, UpbitModule, Web3Module, WithdrawModule, CroffleGatewayModule],
    controllers: [HealthController],
    providers: [{ provide: APP_FILTER, useClass: AllExceptionsFilter }, Logger],
})
export class AppModule {}
