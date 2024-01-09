import { Injectable } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { OrderRepository } from 'src/api/order/repository/order.repository';
import { Order } from 'src/model/entity/order.entity';

import { FindOrderWithOrderPayReqDTO } from 'src/api/order/dto/order.req.dto';

@Injectable()
export class OrderService {
    constructor(
        @InjectRepository(OrderRepository)
        private readonly orderRepository: OrderRepository,
    ) {}

    public async findOrderWithOrderPay(findOrderWithOrderPayReqDTO: FindOrderWithOrderPayReqDTO): Promise<Order> {
        return await this.orderRepository.findOrderWithOrderPay(findOrderWithOrderPayReqDTO);
    }
}
