import { Injectable } from '@nestjs/common';

import { DataSource, Repository } from 'typeorm';
import { OrderPay } from 'src/model/entity/order-pay.entity';

import { ResImpl } from 'src/common/res/res.implement';
import { UPDATE_FAILED } from 'src/common/const/error.const';

import { UpdateOrderPayReqDTO } from 'src/api/orderPay/dto/orderPay.req.dto';

@Injectable()
export class OrderPayRepository extends Repository<OrderPay> {
    constructor(private dataSource: DataSource) {
        super(OrderPay, dataSource.createEntityManager());
    }

    public async updateOrderPay(updateOrderPayReqDTO: UpdateOrderPayReqDTO): Promise<void> {
        try {
            await this.update(
                { sq: updateOrderPayReqDTO.order_pay_sq },
                {
                    pay_sq_list: updateOrderPayReqDTO.pay_sq_list,
                    pay_price: updateOrderPayReqDTO.pay_price,
                    pay_status: updateOrderPayReqDTO.pay_status,
                },
            );
        } catch (error) {
            console.error(error);
            throw new ResImpl(UPDATE_FAILED);
        }
    }
}
