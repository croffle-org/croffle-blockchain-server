import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

/**
 * @dev 환경변수 모듈 세팅
 * @description
 * * 1. envFilePath : env 파일의 경로 ( 시작경로는 root dir )
 * * 2. isGlobal : true로 설정 시 ConfigModule을 전역 모듈로 선언하여 다른 모듈에서 사용
 * * 3. cache : 한번 읽은 환경 변수의 값을 캐싱하여 읽기 속도를 향상
 */
@Module({
    imports: [
        ConfigModule.forRoot({
            envFilePath: `src/config/env/${process.env.NODE_ENV === 'production' ? '.env.prod' : process.env.NODE_ENV === 'testing' ? '.env.test' : '.env.dev'}`,
            isGlobal: true,
            cache: true,
        }),
    ],
})
export class EnvConfigModule {}
