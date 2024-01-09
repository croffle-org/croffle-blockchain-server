import { Module } from '@nestjs/common';

import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from 'src/model/entity/order.entity';
import { OrderPay } from 'src/model/entity/order-pay.entity';

import { OrderService } from 'src/api/order/service/order.service';
import { OrderRepository } from 'src/api/order/repository/order.repository';

@Module({
    imports: [TypeOrmModule.forFeature([Order, OrderPay])],
    providers: [OrderService, OrderRepository],
    exports: [OrderService],
})
export class OrderModule {}
