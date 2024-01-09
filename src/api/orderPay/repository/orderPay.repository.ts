import { Injectable } from '@nestjs/common';

import { DataSource, Repository } from 'typeorm';
import { OrderPay } from 'src/model/entity/order-pay.entity';

import { ResImpl } from 'src/common/res/res.implement';
import { SELECT_FAILED, UPDATE_FAILED } from 'src/common/const/error.const';

import { OrderPayReqDTO } from 'src/api/orderPay/dto/orderPay.req.dto';

@Injectable()
export class OrderPayRepository extends Repository<OrderPay> {
    constructor(private dataSource: DataSource) {
        super(OrderPay, dataSource.createEntityManager());
    }

    // * OrderPay 테이블 업데이트
    public async updateOrderPay(orderPayReqDTO: OrderPayReqDTO) {
        try {
        } catch (error) {
            console.error(error.message);
            throw new ResImpl(UPDATE_FAILED);
        }
    }
}
