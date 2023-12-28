import { Injectable } from '@nestjs/common';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';

import { TypeOrmLoggerConfig } from 'src/config/typeorm-logger/typeorm-logger.config';

import { DepositList } from 'src/model/entity/deposit-list.entity';
import { AccountWallet } from 'src/model/entity/account-wallet.entity';
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
            type: 'mysql',
            name: MysqlTypeOrmConfig.connectionName,
            host: process.env.MYSQL_HOST,
            port: parseInt(process.env.MYSQL_PORT, 10) || 3306,
            username: process.env.MYSQL_USERNAME,
            password: process.env.MYSQL_PASSWORD,
            database: process.env.MYSQL_DATABASE,
            retryAttempts: 5,
            synchronize: false,
            logging: true,
            logger: TypeOrmLoggerConfig.forConnection(MysqlTypeOrmConfig.connectionName, 'all'),
            entities: [DepositList, AccountWallet, WithdrawList],
        };
    }
}
