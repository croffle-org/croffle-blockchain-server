import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { VersioningType } from '@nestjs/common';
import { Transport } from '@nestjs/microservices';

import { AppModule } from 'src/app.module';

import { LogginInterceptor } from 'src/interceptor/logger.interceptor';
import { validationPipeConfig } from 'src/util/validation.util';
import { AllExceptionsFilter } from 'src/filter/common.exception.filter';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    // * 사용할 logger 레벨 설정
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

    // * Kakfa 설정
    // app.connectMicroservice({
    //     transport: Transport.KAFKA,
    //     options: {
    //         client: {
    //             clientId: 'croffle',
    //             brokers: ['localhost:9092'],
    //         },
    //         consumer: {
    //             groupId: 'croffle-consumer',
    //         },
    //     },
    // });

    // * 마이크로서비스 실행
    // await app.startAllMicroservices();

    // * 서버 실행
    await app.listen(process.env['PORT']);
}
bootstrap();
