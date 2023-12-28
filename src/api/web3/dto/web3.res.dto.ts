import { Expose } from 'class-transformer';
import { IsNumber } from 'class-validator';

export class GetTotalSupplyResDTO {
    @Expose({ name: 'total_supply' })
    @IsNumber()
    total_supply: number;
}
