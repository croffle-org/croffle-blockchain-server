import { Injectable } from '@nestjs/common';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { LogLevel } from 'typeorm';

import { TypeOrmLoggerConfig } from 'src/config/typeorm-logger/typeorm-logger.config';

import { AccountWallet } from 'src/model/entity/account-wallet.entity';
import { DepositList } from 'src/model/entity/deposit-list.entity';
import { Order } from 'src/model/entity/order.entity';
import { OrderPay } from 'src/model/entity/order-pay.entity';
import { Pay } from 'src/model/entity/pay.entity';
import { WithdrawList } from 'src/model/entity/withdraw-list.entity';

/**
 * @dev
 * * 데이터베이스 옵션 세팅
 * @description
 * * 1. retryAttempts : 데이터베이스 연결 시도 횟수 (default : 10)
 * * 2. autoLoadEntities : true로 설정 시 엔티티를 자동으로 로드
 * * 3. synchronize : 데이터베이스와 ORM을 연동
 */
@Injectable()
export class MysqlTypeOrmConfig implements TypeOrmOptionsFactory {
    static connectionName: string = process.env.NODE_ENV;

    createTypeOrmOptions(): TypeOrmModuleOptions {
        return {
            type: 'mariadb',
            name: MysqlTypeOrmConfig.connectionName,
            host: process.env.MYSQL_HOST,
            port: parseInt(process.env.MYSQL_PORT, 10) || 3306,
            username: process.env.MYSQL_USERNAME,
            password: process.env.MYSQL_PASSWORD,
            database: process.env.MYSQL_DATABASE,
            retryAttempts: 5,
            synchronize: false,
            maxQueryExecutionTime: 10000,
            logging: true,
            logger: new TypeOrmLoggerConfig(process.env.CROFFLE_BLOCKCHAIN_SERVER_LOG_LEVEL_DB.split('|') as LogLevel[]),
            entities: [AccountWallet, DepositList, Order, OrderPay, Pay, WithdrawList],
        };
    }
}
