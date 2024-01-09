import { Expose, Type } from 'class-transformer';
import { IsNumber } from 'class-validator';

export class FindOrderWithOrderPayReqDTO {
    @Expose({ name: 'account_sq' })
    @IsNumber()
    account_sq: number;
}
