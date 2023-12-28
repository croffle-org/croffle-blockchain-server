import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { MysqlTypeOrmConfig } from 'src/config/database/mysql.config';

@Module({
    imports: [
        TypeOrmModule.forRootAsync({
            useClass: MysqlTypeOrmConfig,
        }),
    ],
})
export class DatabaseModule {}
