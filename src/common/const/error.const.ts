import { Res } from 'src/common/res/res.interface';

// * common
export const SUCCESS: Res = { code: 0, message: '성공' };
export const INVALID_PARAM: Res = { code: 1, message: '잘못된 파라미터 입니다.' };
export const INTERNAL_SERVER_ERROR: Res = { code: 2, message: '내부 서버 오류가 발생했습니다.' };
export const WRONG_APPROACH: Res = { code: 3, message: '요청 경로를 찾을 수 없습니다.' };
export const NOT_HAVE_ACCESS: Res = { code: 4, message: '접근 권한이 없습니다.' };
export const BAD_GATEWAY: Res = { code: 5, message: '요청 리소스에 연결할 수 없습니다.' };
export const GATEWAY_TIMEOUT: Res = { code: 6, message: '요청 시간이 초과 되었습니다.' };
export const UNAUTHORIZED_ERROR: Res = { code: 7, message: '인증되지 않은 요청입니다.' };

// * database
export const SELECT_FAILED: Res = { code: 1001, message: '데이터베이스에 데이터를 불러오지 못했습니다.' };
export const INSERT_FAILED: Res = { code: 1002, message: '데이터베이스에 데이터를 생성하지 못했습니다.' };
export const UPDATE_FAILED: Res = { code: 1003, message: '데이터베이스에 데이터를 변경하지 못했습니다.' };

// * web3
export const SEND_TRANSACTION_FAILED: Res = { code: 2001, message: '트랜잭션을 보내는데 실패하였습니다.' };
export const GET_TOTALSUPPLY_FAILED: Res = { code: 2002, message: '총 발행량을 조회하는데 실패하였습니다.' };
export const ADJUST_TOTALSUPPLY_FAILED: Res = { code: 2003, message: '총 발행량을 조절하는데 실패하였습니다.' };
export const TRANSFER_TO_USER_FAILED: Res = { code: 2004, message: '사용자에게 토큰을 전송하는데 실패하였습니다.' };
export const TRANSFER_TO_TOTALSUPPLY_MANAGER_FAILED: Res = { code: 2005, message: '총 공급량 관리자에게 토큰을 전송하는데 실패하였습니다.' };

// * upbit
export const GET_ACCESS_TOKEN_FAILED: Res = { code: 3001, message: 'Upbit Access 토큰을 조회하는데 실패하였습니다.' };
export const SET_ACCESS_TOKEN_FAILED: Res = { code: 3002, message: 'Upbit Access 토큰을 변경하는데 실패하였습니다.' };
export const GET_KRW_BALANCE_FAILED: Res = { code: 3003, message: '원화 보유량을 조회하는데 실패하였습니다.' };
export const GET_TOKEN_PRICE_FAILED: Res = { code: 3004, message: '토큰 가격을 조회하는데 실패하였습니다.' };
export const GET_TRANSACTION_DETAIL_FAILED: Res = { code: 3005, message: '거래 정보를 조회하는데 실패하였습니다.' };
export const GET_TOKEN_DEPOSITS_FAILED: Res = { code: 3006, message: '토큰 입금 내역을 조회하는데 실패하였습니다.' };
export const TOKEN_WITHDRAW_FAILED: Res = { code: 3007, message: '토큰 출금을 실패하였습니다.' };
