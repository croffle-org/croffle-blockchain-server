import { Inject, Injectable } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { PayRepository } from 'src/api/pay/repository/pay.repository';

import { plainToInstance } from 'class-transformer';
import { InsertPayReqDTO } from 'src/api/pay/dto/pay.req.dto';
import { InsertPayResDTO } from 'src/api/pay/dto/pay.res.dto';
import { CustomLogger } from 'src/config/logger/custom.logger.config';

@Injectable()
export class PayService {
    constructor(
        @Inject('CROFFLE_BLOCKCHAIN_SERVER_LOG')
        private readonly logger: CustomLogger,
        @InjectRepository(PayRepository)
        private readonly payRepository: PayRepository,
    ) {}

    public async insertPay(insertPayReqDTO: InsertPayReqDTO): Promise<InsertPayResDTO> {
        try {
            const insertData = await this.payRepository.insertPay(insertPayReqDTO);
            return plainToInstance(InsertPayResDTO, { pay: insertData }, { exposeUnsetFields: false });
        } catch (error) {
            this.logger.logError(this.constructor.name, this.insertPay.name, error);
            throw error;
        }
    }
}
