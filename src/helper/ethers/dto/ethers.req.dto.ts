import { Expose } from 'class-transformer';
import { IsArray, IsString } from 'class-validator';

export class ConnectContractWithWalletReqDTO {
    @Expose({ name: 'privateKey' })
    @IsString()
    privateKey: string;
}

export class SendTransactionReqDTO {
    @Expose({ name: 'privateKey' })
    @IsString()
    privateKey: string;

    @Expose({ name: 'method' })
    @IsString()
    method: string;

    @Expose({ name: 'params' })
    @IsArray()
    params: any[];
}
