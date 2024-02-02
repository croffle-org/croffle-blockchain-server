import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class CustomLogger extends Logger {
    private environment = process.env.NODE_ENV;

    log(message: string, context?: string) {
        super.log(`[LOG] [${context}] ${message}`);
    }

    error(message: string, trace: string, context?: string) {
        super.error(`[ERROR] [${context}] ${message}`, trace);
    }

    warn(message: string, context?: string) {
        super.warn(`[WARN] [${context}] ${message}`);
    }

    debug(message: string, context?: string) {
        super.debug(`[DEBUG] [${context}] ${message}`);
    }

    verbose(message: string, context?: string) {
        super.log(`[VERBOSE] [${context}] ${message}`);
    }

    logMethodEntry(className: string, methodName: string, data: any) {
        super.log(`Class : ${className}, Method: ${methodName}, Data: ${JSON.stringify(data)}`);
    }

    logError(className: string, methodName: string, error: any) {
        // 에러 메시지 추출
        const errorMessage = `Error Message: ${error.message}`;

        // 스택 트레이스에서 첫 번째 라인 추출 및 정리
        const firstStackTraceLine = error.stack.split('\n')[1].trim();
        const simplifiedStackTrace = firstStackTraceLine.replace(/\s+at\s+/, ''); // 'at'과 공백 제거

        // 에러 발생 위치 추출
        const errorLocationMatch = simplifiedStackTrace.match(/\((.*?):(\d+):(\d+)\)$/);
        const errorLocation = errorLocationMatch ? `Location: ${errorLocationMatch[1]}:${errorLocationMatch[2]}` : 'Location: unavailable';

        // 최종 로그 메시지 구성
        const logMessage = `Error Method : ${methodName} | ${errorMessage} \n ${errorLocation}`;

        if (this.environment === 'development') {
            // 개발 환경에서는 전체 스택 트레이스를 디버그 레벨로 로깅
            super.debug(`${logMessage} \n Full Stack: ${error.stack}`, className);
        } else {
            // 운영 환경에서는 간소화된 에러 정보만 로깅
            super.error(logMessage, null, className);
        }
    }
}
