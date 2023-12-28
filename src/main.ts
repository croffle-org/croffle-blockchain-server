import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { VersioningType } from '@nestjs/common';

import { AppModule } from 'src/app.module';

import { LogginInterceptor } from 'src/interceptor/logger.interceptor';
import { validationPipeConfig } from 'src/util/validation.util';
import { AllExceptionsFilter } from './filter/common.exception.filter';

async function bootstrap() {
    // * 사용할 logger 레벨 설정
    const app = await NestFactory.create(AppModule);

    // app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));

    // * CORS 설정
    app.enableCors();

    // * API 버저닝 설정 ( URI )
    app.enableVersioning({ type: VersioningType.URI, prefix: 'v' });

    // * 로깅 인터셉터 설정
    app.useGlobalInterceptors(new LogginInterceptor());

    // * 유효성 검사 설정
    app.useGlobalPipes(validationPipeConfig);

    // * 예외처리 필터 설정
    app.useGlobalFilters(new AllExceptionsFilter(app.get(HttpAdapterHost)));

    // * PORT 설정
    await app.listen(process.env['PORT']);
}
bootstrap();
