import { Module } from '@nestjs/common';

import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderPay } from 'src/model/entity/order-pay.entity';

@Module({
    imports: [TypeOrmModule.forFeature([OrderPay])],
    providers: [],
    exports: [],
})
export class OrderPayModule {}
