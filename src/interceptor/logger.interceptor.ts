import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Logger } from '@nestjs/common';

import { Observable, tap } from 'rxjs';
import os from 'os';

@Injectable()
export class LogginInterceptor implements NestInterceptor {
    private logger = new Logger('HTTP');

    intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
        const hostname = os.hostname();
        const { method, url, ip, headers, body, query, params } = context.switchToHttp().getRequest();

        this.logger.debug(`[${hostname}] - Request : ${method} ${url} ${ip}`);
        this.logger.debug(`Headers : ${JSON.stringify(headers)}`);
        if (Object.keys(body).length > 0) this.logger.debug(`Body : ${JSON.stringify(body)}`);
        if (Object.keys(query).length > 0) this.logger.debug(`Query : ${JSON.stringify(query)}`);
        if (Object.keys(params).length > 0) this.logger.debug(`Params : ${JSON.stringify(params)}`);

        return next.handle().pipe(
            tap((response) => {
                const { code, message, data } = response;

                this.logger.log(`[${hostname}] - Response : {Method: ${method}, URL: ${url}, IP: ${ip}, Status Code: ${code}, Message: ${message}, Data: ${JSON.stringify(data)}}`);
            }),
        );
    }
}
