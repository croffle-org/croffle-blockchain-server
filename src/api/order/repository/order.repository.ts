import { Injectable } from '@nestjs/common';

import { DataSource, Repository } from 'typeorm';
import { Order } from 'src/model/entity/order.entity';

import { ResImpl } from 'src/common/res/res.implement';
import { SELECT_FAILED } from 'src/common/const/error.const';

import { PayStatus } from 'src/common/const/enum.const';

import { FindOrderWithOrderPayReqDTO } from 'src/api/order/dto/order.req.dto';

@Injectable()
export class OrderRepository extends Repository<Order> {
    constructor(private dataSource: DataSource) {
        super(Order, dataSource.createEntityManager());
    }

    // query문 수정
    public async findOrderWithOrderPay(findOrderWithOrderPayReqDTO: FindOrderWithOrderPayReqDTO): Promise<Order> {
        try {
            return await this.createQueryBuilder('order')
                .leftJoinAndSelect('order.orderPay', 'orderPay')
                .where('order.account_sq = :account_sq', { account_sq: findOrderWithOrderPayReqDTO.account_sq })
                .andWhere('orderPay.pay_status = :status', { status: PayStatus.WAIT })
                .orderBy('order.insert_dttm', 'DESC')
                .getOne();
        } catch (error) {
            console.error(error);
            throw new ResImpl(SELECT_FAILED);
        }
    }
}
