import { Injectable } from '@nestjs/common';
import { Logger } from '@nestjs/common';
import { Logger as TypeOrmLogger, QueryRunner } from 'typeorm';
import { LoggerOptions as TypeOrmLoggerOptions } from 'typeorm/logger/LoggerOptions';

/**
 * @dev
 * * TypeORM Custom Logger 설정
 */

@Injectable()
export class TypeOrmLoggerConfig implements TypeOrmLogger {
    static forConnection(connectionName: string, options: TypeOrmLoggerOptions) {
        const logger: Logger = new Logger(`TypeORM_${connectionName}`, { timestamp: true });
        return new TypeOrmLoggerConfig(logger, options);
    }

    constructor(private readonly logger: Logger, private readonly options: TypeOrmLoggerOptions) {
        this.logger = logger;
    }

    logQuery(query: string, parameters?: any[], queryRunner?: QueryRunner) {
        if (this.options === 'all' || this.options === true || (this.options instanceof Array && this.options.indexOf('query') !== -1)) {
            const sql = query + (parameters && parameters.length ? '-- PARAMETERS : ' + this.stringifyParams(parameters) : '');
            this.logger.verbose('[logQuery] - query : ' + sql);
        }
    }

    logQueryError(error: string | Error, query: string, parameters?: any[], queryRunner?: QueryRunner) {
        if (this.options === 'all' || this.options === true || (this.options instanceof Array && this.options.indexOf('query') !== -1)) {
            const sql = query + (parameters && parameters.length ? '-- PARAMETERS : ' + this.stringifyParams(parameters) : '');
            this.logger.error('[logQueryError] - query faild : ' + sql);
            this.logger.error('[logQueryError] - error : ' + error);
        }
    }

    logQuerySlow(time: number, query: string, parameters?: any[], queryRunner?: QueryRunner) {
        const sql = query + (parameters && parameters.length ? '-- PARAMETERS : ' + this.stringifyParams(parameters) : '');
        this.logger.log('[logQuerySlow] - query is slow : ' + sql);
        this.logger.log('[logQuerySlow] - exection time : ' + time);
    }

    logSchemaBuild(message: string, queryRunner?: QueryRunner) {
        if (this.options === 'all' || (this.options instanceof Array && this.options.indexOf('schema') !== -1)) {
            this.logger.log('[logSchemaBuild] - build message : ', message);
        }
    }

    logMigration(message: string, queryRunner?: QueryRunner) {
        this.logger.log('[logMigration] - migration message', message);
    }

    log(level: 'log' | 'info' | 'warn', message: any, queryRunner?: QueryRunner) {
        switch (level) {
            case 'log':
                if (this.options === 'all' || (this.options instanceof Array && this.options.indexOf('log') !== -1)) this.logger.log('[log] - ' + message);
                break;
            case 'info':
                if (this.options === 'all' || (this.options instanceof Array && this.options.indexOf('info') !== -1)) this.logger.debug('[log] - ' + message);
                break;
            case 'warn':
                if (this.options === 'all' || (this.options instanceof Array && this.options.indexOf('warn') !== -1)) this.logger.warn('[log] - ' + message);
                break;
        }
    }

    protected stringifyParams(parameters: any[]) {
        try {
            return JSON.stringify(parameters);
        } catch (error) {
            return parameters;
        }
    }
}
