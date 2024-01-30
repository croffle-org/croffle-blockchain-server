import { Inject, Injectable } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { OrderPayRepository } from 'src/api/orderPay/repository/orderPay.repository';

import { UpdateOrderPayReqDTO } from 'src/api/orderPay/dto/orderPay.req.dto';
import { CustomLogger } from 'src/config/logger/custom.logger.config';

@Injectable()
export class OrderPayService {
    constructor(
        @Inject('CROFFLE_BLOCKCHAIN_SERVER_LOG')
        private readonly logger: CustomLogger,
        @InjectRepository(OrderPayRepository)
        private readonly orderPayRepository: OrderPayRepository,
    ) {}

    public async updateOrderPay(updateOrderPayReqDTO: UpdateOrderPayReqDTO): Promise<void> {
        try {
            return await this.orderPayRepository.updateOrderPay(updateOrderPayReqDTO);
        } catch (error) {
            this.logger.logError(this.constructor.name, this.updateOrderPay.name, error);
            throw error;
        }
    }
}
