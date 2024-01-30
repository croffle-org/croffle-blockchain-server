import { Expose } from 'class-transformer';
import { IsString } from 'class-validator';

export class UpbitGetRequestReqDTO {
    @Expose({ name: 'endpoint' })
    @IsString()
    endpoint: string;

    @Expose({ name: 'query' })
    query: any;
}

export class UpbitPostRequestReqDTO {
    @Expose({ name: 'endpoint' })
    @IsString()
    endpoint: string;

    @Expose({ name: 'body' })
    body: any;
}

export class AxiosGetRequestReqDTO {
    @Expose({ name: 'url' })
    @IsString()
    url: string;

    @Expose({ name: 'header' })
    header?: any;
}
