import { Module } from '@nestjs/common';

import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderPay } from 'src/model/entity/order-pay.entity';

import { OrderPayService } from 'src/api/orderPay/service/orderPay.service';
import { OrderPayRepository } from 'src/api/orderPay/repository/orderPay.repository';

@Module({
    imports: [TypeOrmModule.forFeature([OrderPay])],
    providers: [OrderPayService, OrderPayRepository],
    exports: [OrderPayService],
})
export class OrderPayModule {}
