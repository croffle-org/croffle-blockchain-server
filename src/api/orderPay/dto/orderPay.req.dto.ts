import { Expose, Type } from 'class-transformer';
import { IsEnum, IsNumber, IsString } from 'class-validator';
import { PayStatus } from 'src/common/const/enum.const';

export class UpdateOrderPayReqDTO {
    @Expose({ name: 'order_pay_sq' })
    @IsNumber()
    order_pay_sq: number;

    @Expose({ name: 'pay_sq_list' })
    @IsString()
    pay_sq_list: string;

    @Expose({ name: 'pay_price' })
    @IsNumber()
    pay_price: number;

    @Expose({ name: 'pay_status' })
    @IsEnum(PayStatus)
    pay_status: PayStatus;
}
