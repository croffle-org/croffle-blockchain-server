import { Injectable } from '@nestjs/common';

import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';

import { AixosGetRequestReqDTO, UpbitGetRequestReqDTO, UpbitPostRequestReqDTO } from 'src/helper/axios/dto/axios.req.dto';

import { sign } from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { createHash } from 'crypto';
import { encode as queryEncode } from 'querystring';

@Injectable()
export class AxiosHelper {
    constructor(private readonly configService: ConfigService, private readonly httpService: HttpService) {}

    private readonly UPBIT_URL: string = this.configService.get<string>('UPBIT_URL');
    private readonly UPBIT_API_KEY: string = this.configService.get<string>('UPBIT_API_KEY');
    private readonly UPBIT_SECRET_KEY: string = this.configService.get<string>('UPBIT_SECRET_KEY');

    public async upbitGetRequest(upbitGetRequestReqDTO: UpbitGetRequestReqDTO): Promise<any> {
        const hash = createHash('sha512');
        const queryHash = hash.update(upbitGetRequestReqDTO.query, 'utf-8').digest('hex');

        const payload = {
            access_key: this.UPBIT_API_KEY,
            nonce: uuidv4(),
            query_hash: queryHash,
            query_hash_alg: 'SHA512',
        };

        const token = sign(payload, this.UPBIT_SECRET_KEY);

        const requestConfig = { headers: { Authorization: `Bearer ${token}` } };

        try {
            const response = await this.httpService.axiosRef.get(`${this.UPBIT_URL}${upbitGetRequestReqDTO.endpoint}?${upbitGetRequestReqDTO.query}`, requestConfig);
            return response.data;
        } catch (error) {
            throw new Error(error);
        }
    }

    public async upbitPostRequest(upbitPostRequestReqDTO: UpbitPostRequestReqDTO): Promise<any> {
        const query = queryEncode(upbitPostRequestReqDTO.body);

        const hash = createHash('sha512');
        const queryHash = hash.update(query, 'utf-8').digest('hex');

        const payload = {
            access_key: this.UPBIT_API_KEY,
            nonce: uuidv4(),
            query_hash: queryHash,
            query_hash_alg: 'SHA512',
        };

        const token = sign(payload, this.UPBIT_SECRET_KEY);

        const requestConfig = { headers: { Authorization: `Bearer ${token}` } };

        try {
            const response = await this.httpService.axiosRef.post(`${this.UPBIT_URL}${upbitPostRequestReqDTO.endpoint}`, upbitPostRequestReqDTO.body, requestConfig);
            return response.data;
        } catch (error) {
            throw new Error(error);
        }
    }

    public async aixosGetRequest(aixosGetRequestReqDTO: AixosGetRequestReqDTO): Promise<any> {
        try {
            const response = await this.httpService.axiosRef.get(aixosGetRequestReqDTO.url, aixosGetRequestReqDTO.header);
            return response.data;
        } catch (error) {
            if (error.response.status !== 401) {
                throw new Error(error);
            }
        }
    }
}
