import { Module } from '@nestjs/common';

import { CustomLoggerModule } from 'src/module/custom.logger.module';

import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from 'src/model/entity/order.entity';
import { OrderPay } from 'src/model/entity/order-pay.entity';

import { OrderService } from 'src/api/order/service/order.service';
import { OrderRepository } from 'src/api/order/repository/order.repository';

@Module({
    imports: [CustomLoggerModule, TypeOrmModule.forFeature([Order, OrderPay])],
    providers: [OrderService, OrderRepository],
    exports: [OrderService],
})
export class OrderModule {}
