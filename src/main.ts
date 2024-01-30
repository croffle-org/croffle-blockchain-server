import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { LogLevel, VersioningType } from '@nestjs/common';

import { AppModule } from 'src/app.module';

import { LoggingInterceptor } from 'src/interceptor/logger.interceptor';
import { validationPipeConfig } from 'src/util/validation.util';
import { AllExceptionsFilter } from 'src/filter/common.exception.filter';

async function bootstrap() {
    const app = await NestFactory.create(AppModule, { logger: (process.env['CROFFLE_BLOCKCHAIN_SERVER_LOG_LEVEL'] as string).split('|') as LogLevel[] });

    // * CORS 설정
    app.enableCors();

    // * API 버저닝 설정 ( URI )
    app.enableVersioning({ type: VersioningType.URI, prefix: 'v' });

    // * 로깅 인터셉터 설정
    app.useGlobalInterceptors(new LoggingInterceptor());

    // * 유효성 검사 설정
    app.useGlobalPipes(validationPipeConfig);

    // * 예외처리 필터 설정
    app.useGlobalFilters(new AllExceptionsFilter(app.get(HttpAdapterHost)));

    // * 서버 실행
    await app.listen(process.env['PORT']);
}
bootstrap();
