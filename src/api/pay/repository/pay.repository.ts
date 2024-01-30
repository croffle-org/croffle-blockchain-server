import { Inject, Injectable } from '@nestjs/common';

import { DataSource, Repository } from 'typeorm';
import { Pay } from 'src/model/entity/pay.entity';

import { ResImpl } from 'src/common/res/res.implement';
import { SELECT_FAILED } from 'src/common/const/error.const';

import { InsertPayReqDTO } from 'src/api/pay/dto/pay.req.dto';
import { CustomLogger } from 'src/config/logger/custom.logger.config';

@Injectable()
export class PayRepository extends Repository<Pay> {
    constructor(
        @Inject('CROFFLE_BLOCKCHAIN_SERVER_LOG')
        private readonly logger: CustomLogger,
        private dataSource: DataSource,
    ) {
        super(Pay, dataSource.createEntityManager());
    }

    public async insertPay(insertPayReqDTO: InsertPayReqDTO): Promise<Pay> {
        try {
            return await this.save(insertPayReqDTO.pay);
        } catch (error) {
            this.logger.logError(this.constructor.name, this.insertPay.name, error);
            throw new ResImpl(SELECT_FAILED);
        }
    }
}
