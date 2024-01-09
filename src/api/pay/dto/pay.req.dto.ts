import { Expose, Type } from 'class-transformer';
import { IsObject, ValidateNested } from 'class-validator';
import { Pay } from 'src/model/entity/pay.entity';

export class InsertPayReqDTO {
    @Expose({ name: 'pay' })
    @ValidateNested({ each: true })
    @Type(() => Pay)
    @IsObject()
    pay: Pay;
}
