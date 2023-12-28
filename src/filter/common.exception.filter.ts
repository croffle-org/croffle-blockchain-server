import { ArgumentsHost, BadRequestException, BadGatewayException, Catch, ExceptionFilter, ForbiddenException, HttpException, Logger, NotFoundException, GatewayTimeoutException, HttpStatus, UnauthorizedException } from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';

import { Res } from 'src/common/res/res.interface';
import { ResImpl } from 'src/common/res/res.implement';

import { BAD_GATEWAY, GATEWAY_TIMEOUT, INTERNAL_SERVER_ERROR, INVALID_PARAM, NOT_HAVE_ACCESS, UNAUTHORIZED_ERROR, WRONG_APPROACH } from 'src/common/const/error.const';

import os from 'os';
/**
 * @dev
 * * 애플리케이션에서 처리되지 않은 모든 예외를 처리하는 필터
 * @description
 * * 1. @catch(HttpException) : 필터가 HTTP 예외를 찾도록 설정
 * * 2. HttpAdapterHost : HTTP 요청 및 응답을 처리하는 어댑터
 * * 3. ArgumentsHost : HTTP 요청을 처리하는 중 발생한 예외에 대한 정보를 제공
 * * 4. httpAdapter (AbstractHttpAdapter) : HTTP 어댑터의 추상화된 인터페이스를 제공
 * * 5. switchToHttp method : HTTP 요청에 대한 정보를 추출
 */
@Catch(HttpException)
export class AllExceptionsFilter implements ExceptionFilter {
    constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

    catch(exception: HttpException, host: ArgumentsHost): void {
        const { httpAdapter } = this.httpAdapterHost;
        const hostname = os.hostname();

        const ctx = host.switchToHttp();

        let httpResponseBody: Res;

        if (exception instanceof BadRequestException) {
            httpResponseBody = INVALID_PARAM;
        } else if (exception instanceof UnauthorizedException) {
            httpResponseBody = UNAUTHORIZED_ERROR;
        } else if (exception instanceof ForbiddenException) {
            httpResponseBody = NOT_HAVE_ACCESS;
        } else if (exception instanceof NotFoundException) {
            httpResponseBody = WRONG_APPROACH;
        } else if (exception instanceof BadGatewayException) {
            httpResponseBody = BAD_GATEWAY;
        } else if (exception instanceof GatewayTimeoutException) {
            httpResponseBody = GATEWAY_TIMEOUT;
        }

        if (!httpResponseBody) {
            httpResponseBody = INTERNAL_SERVER_ERROR;
            new Logger(AllExceptionsFilter.name).error(`[${hostname}] - Error : ${JSON.stringify(exception['response'])}`, exception.stack);
            httpAdapter.reply(ctx.getResponse(), new ResImpl(httpResponseBody), HttpStatus.INTERNAL_SERVER_ERROR);
        } else {
            new Logger(AllExceptionsFilter.name).error(`[${hostname}] - Error : ${JSON.stringify(httpResponseBody)}`, exception.stack);
            httpAdapter.reply(ctx.getResponse(), new ResImpl(httpResponseBody), exception.getStatus());
        }
    }
}
