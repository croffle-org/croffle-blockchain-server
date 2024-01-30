import { Module } from '@nestjs/common';
import { CustomLogger } from 'src/config/logger/custom.logger.config';

@Module({
    providers: [
        {
            provide: 'CROFFLE_BLOCKCHAIN_SERVER_LOG',
            useClass: CustomLogger,
        },
    ],
    exports: ['CROFFLE_BLOCKCHAIN_SERVER_LOG'],
})
export class CustomLoggerModule {}
