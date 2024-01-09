import { Expose, Type } from 'class-transformer';
import { IsObject } from 'class-validator';
import { Pay } from 'src/model/entity/pay.entity';

export class InsertPayResDTO {
    @Expose({ name: 'pay' })
    @IsObject()
    pay: Pay;
}
