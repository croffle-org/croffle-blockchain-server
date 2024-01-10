import { Injectable } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { OrderPayRepository } from 'src/api/orderPay/repository/orderPay.repository';

import { UpdateOrderPayReqDTO } from 'src/api/orderPay/dto/orderPay.req.dto';

@Injectable()
export class OrderPayService {
    constructor(
        @InjectRepository(OrderPayRepository)
        private readonly orderPayRepository: OrderPayRepository,
    ) {}

    public async updateOrderPay(updateOrderPayReqDTO: UpdateOrderPayReqDTO): Promise<void> {
        return await this.orderPayRepository.updateOrderPay(updateOrderPayReqDTO);
    }
}
