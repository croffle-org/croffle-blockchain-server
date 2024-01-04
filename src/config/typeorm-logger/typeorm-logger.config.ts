import { Logger } from '@nestjs/common';
import { QueryRunner, LogLevel, LogMessage, LogMessageType, LoggerOptions } from 'typeorm';

import { AbstractLogger } from 'typeorm';

/**
 * @dev
 * * TypeORM의 로깅을 위한 커스텀 로거 구성
 * @description
 * * 1. LogLevel: 로그의 심각도 수준을 정의
 * * 2. LogMessage: 로그 메시지의 구조를 정의
 * * 3. LogMessageType: 가능한 로그 메시지 유형을 정의
 * * 4. LoggerOptions: TypeORM 로거 구성에 사용되는 옵션을 정의
 * * 5. AbstractLogger: TypeORM에 의해 사용될 로거의 추상 클래스를 제공
 * * 6. prepareLogMessages: 로그 메시지를 준비하는 메소드로 다음과 같은 기능 제공
 * * - SQL 하이라이팅
 * * - SQL 사용된 파라미터 확인
 * * - SQL 접두사에 : 추가
 */
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
        const logger = this.logger;
        return (message: any) => {
            switch (effectiveLevel) {
                case 'log':
                case 'schema-build':
                case 'migration':
                    logger.log(message);
                    break;
                case 'info':
                case 'query':
                    logger.verbose(message);
                    break;
                case 'warn':
                case 'query-slow':
                    logger.warn(message);
                    break;
                case 'error':
                case 'query-error':
                    logger.error(message);
                    break;
                default:
                    logger.log(message);
            }
        };
    }
}
