import { Module } from '@nestjs/common';

import { TypeOrmModule } from '@nestjs/typeorm';
import { Pay } from 'src/model/entity/pay.entity';

import { PayService } from 'src/api/pay/service/pay.service';
import { PayRepository } from 'src/api/pay/repository/pay.repository';

@Module({
    imports: [TypeOrmModule.forFeature([Pay])],
    providers: [PayService, PayRepository],
    exports: [PayService],
})
export class PayModule {}
