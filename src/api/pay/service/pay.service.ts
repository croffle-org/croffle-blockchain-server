import { Injectable } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { PayRepository } from 'src/api/pay/repository/pay.repository';

import { plainToInstance } from 'class-transformer';
import { InsertPayReqDTO } from 'src/api/pay/dto/pay.req.dto';
import { InsertPayResDTO } from 'src/api/pay/dto/pay.res.dto';

@Injectable()
export class PayService {
    constructor(
        @InjectRepository(PayRepository)
        private readonly payRepository: PayRepository,
    ) {}

    public async insertPay(insertPayReqDTO: InsertPayReqDTO): Promise<InsertPayResDTO> {
        const insertData = await this.payRepository.insertPay(insertPayReqDTO);
        return plainToInstance(InsertPayResDTO, { pay: insertData }, { exposeUnsetFields: false });
    }
}
