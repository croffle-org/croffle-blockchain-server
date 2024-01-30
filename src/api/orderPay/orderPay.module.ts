import { Module } from '@nestjs/common';

import { CustomLoggerModule } from 'src/module/custom.logger.module';

import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderPay } from 'src/model/entity/order-pay.entity';

import { OrderPayService } from 'src/api/orderPay/service/orderPay.service';
import { OrderPayRepository } from 'src/api/orderPay/repository/orderPay.repository';

@Module({
    imports: [CustomLoggerModule, TypeOrmModule.forFeature([OrderPay])],
    providers: [OrderPayService, OrderPayRepository],
    exports: [OrderPayService],
})
export class OrderPayModule {}
