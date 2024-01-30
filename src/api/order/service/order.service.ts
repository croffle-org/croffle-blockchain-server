import { Inject, Injectable } from '@nestjs/common';

import { CustomLogger } from 'src/config/logger/custom.logger.config';

import { InjectRepository } from '@nestjs/typeorm';
import { OrderRepository } from 'src/api/order/repository/order.repository';
import { Order } from 'src/model/entity/order.entity';

import { FindOrderWithOrderPayReqDTO } from 'src/api/order/dto/order.req.dto';

@Injectable()
export class OrderService {
    constructor(
        @Inject('CROFFLE_BLOCKCHAIN_SERVER_LOG')
        private readonly logger: CustomLogger,
        @InjectRepository(OrderRepository)
        private readonly orderRepository: OrderRepository,
    ) {}

    public async findOrderWithOrderPay(findOrderWithOrderPayReqDTO: FindOrderWithOrderPayReqDTO): Promise<Order> {
        try {
            return await this.orderRepository.findOrderWithOrderPay(findOrderWithOrderPayReqDTO);
        } catch (error) {
            this.logger.logError(this.constructor.name, this.findOrderWithOrderPay.name, error);
            throw error;
        }
    }
}
