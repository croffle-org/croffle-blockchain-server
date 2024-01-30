import { Inject, Injectable } from '@nestjs/common';

import { DataSource, Repository } from 'typeorm';
import { Order } from 'src/model/entity/order.entity';

import { ResImpl } from 'src/common/res/res.implement';
import { SELECT_FAILED } from 'src/common/const/error.const';

import { PayStatus } from 'src/common/const/enum.const';

import { FindOrderWithOrderPayReqDTO } from 'src/api/order/dto/order.req.dto';
import { CustomLogger } from 'src/config/logger/custom.logger.config';

@Injectable()
export class OrderRepository extends Repository<Order> {
    constructor(
        @Inject('CROFFLE_BLOCKCHAIN_SERVER_LOG')
        private readonly logger: CustomLogger,
        private dataSource: DataSource,
    ) {
        super(Order, dataSource.createEntityManager());
    }

    public async findOrderWithOrderPay(findOrderWithOrderPayReqDTO: FindOrderWithOrderPayReqDTO): Promise<Order> {
        try {
            return await this.createQueryBuilder('order')
                .leftJoinAndSelect('order.orderPay', 'orderPay')
                .where('order.account_sq = :account_sq', { account_sq: findOrderWithOrderPayReqDTO.account_sq })
                .andWhere('orderPay.pay_status = :status', { status: PayStatus.WAIT })
                .orderBy('order.insert_dttm', 'DESC')
                .getOne();
        } catch (error) {
            this.logger.logError(this.constructor.name, this.findOrderWithOrderPay.name, error);
            throw new ResImpl(SELECT_FAILED);
        }
    }
}
