import { Injectable } from '@nestjs/common';

import { DataSource, Repository } from 'typeorm';
import { Pay } from 'src/model/entity/pay.entity';

import { ResImpl } from 'src/common/res/res.implement';
import { SELECT_FAILED } from 'src/common/const/error.const';

import { InsertPayReqDTO } from 'src/api/pay/dto/pay.req.dto';

@Injectable()
export class PayRepository extends Repository<Pay> {
    constructor(private dataSource: DataSource) {
        super(Pay, dataSource.createEntityManager());
    }

    public async insertPay(insertPayReqDTO: InsertPayReqDTO): Promise<Pay> {
        try {
            console.log(insertPayReqDTO.pay);
            return await this.save(insertPayReqDTO.pay);
        } catch (error) {
            console.error(error);
            throw new ResImpl(SELECT_FAILED);
        }
    }
}
