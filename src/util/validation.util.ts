import { ValidationError, ValidationPipe } from '@nestjs/common';

import { Res } from 'src/common/res/res.interface';
import { ResException } from 'src/common/res/res.exception';

import { INVALID_PARAM } from 'src/common/const/error.const';

/**
 * @description
 * * 유효성 검사기에서 에러 발생시 파라미터에 들어온 값과 유효성 검사기에 걸린 이유를 전체적으로 전달
 */
const validationErrorHandling = (errors: ValidationError[]) => {
    errors
        .map((error) => {
            return {
                parameter: error['property'],
                value: error['value'],
                reason: Object.values(error['constraints']),
            };
        })
        .reduce((previousValue, currentValue) => previousValue.concat(currentValue), []);
};

/**
 * @description
 * * 유효성 검사 에러 응답형태를 변환
 */
export const validationErrorThrow = (errorType: Res, errors: ValidationError[]) =>
    new ResException({
        ...errorType,
        ...{ data: { list: validationErrorHandling(errors) } },
    });
/**
 * @description
 * * 유효성 검사 에러를 반환
 */
export const validationParamErrorThrow = (errors: ValidationError[]) => validationErrorThrow(INVALID_PARAM, errors);

/**
 * @dev
 * * 유효성 검사 옵션 세팅 (ValidationPipeOptions)
 * @description
 * * 1. transform : true로 설정 시 일반 javascript 객체를 DTO에 따라 유형이 지정된 객체로 자동 변환
 * * 2. transformOptions.enableImplicitConversion : true로 설정 시 유효성 검사 전 요청 데이터를 원하는 타입으로 변환
 * * 3. whitelist : true로 설정 시 요청이나 응답의 속성 중 허용된 것만 필터링하여 전달
 * * 4. disableErrorMessages : true로 설정 시 유효성 검사 오류를 클라이언트에 반환되지 않음
 * * 5. stopAtFirstError : true로 설정 시 유효성 검사 중 발생한 첫번째 오류에서 검사를 중단하고 해당 오류만 반환합니다.
 * * 6. exceptionFactory : 유효성 검사 오류 배열을 가져와 throw 할 예외 개체를 반환
 */

export const validationPipeConfig = new ValidationPipe({
    transform: true,
    transformOptions: { enableImplicitConversion: true },
    whitelist: true,
    disableErrorMessages: false,
    stopAtFirstError: true,
    exceptionFactory: validationParamErrorThrow,
});
