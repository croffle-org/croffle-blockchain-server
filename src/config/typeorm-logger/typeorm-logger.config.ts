import { Logger } from '@nestjs/common';
import { QueryRunner, LogLevel, LogMessage, LogMessageType, LoggerOptions } from 'typeorm';

import { AbstractLogger } from 'typeorm';

export class TypeOrmLoggerConfig extends AbstractLogger {
    private readonly logger: Logger = new Logger('TypeormLogger');

    constructor(options?: LoggerOptions) {
        super(options);
    }

    protected writeLog(level: LogLevel, logMessage: LogMessage | LogMessage[], queryRunner?: QueryRunner) {
        const messages = this.prepareLogMessages(logMessage, { highlightSql: true, appendParameterAsComment: true, addColonToPrefix: true });

        for (const message of messages) {
            const logFunction = this.getLogFunction(level, message.type);
            const fullMessage = message.prefix ? `${message.prefix} ${message.message}` : message.message;
            logFunction(fullMessage);
        }
    }

    private getLogFunction(level: LogLevel, messageType?: LogMessageType): (...args: any[]) => void {
        const effectiveLevel = messageType ?? level;
        switch (effectiveLevel) {
            case 'log':
            case 'schema-build':
            case 'migration':
                return this.logger.log;
            case 'info':
            case 'query':
                return this.logger.verbose;
            case 'warn':
            case 'query-slow':
                return this.logger.warn;
            case 'error':
            case 'query-error':
                return this.logger.error;
            default:
                return this.logger.log;
        }
    }
}
