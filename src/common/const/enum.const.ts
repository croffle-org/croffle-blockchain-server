export enum METHODS {
    INCREASETOTALSUPPLY = 'increaseTotalSupply',
    DECREASETOTALSUPPLY = 'decreaseTotalSupply',
    TRANSFER = 'transfer',
}

export enum CURRENCY {
    BTC = 'BTC',
    ETH = 'ETH',
    MATIC = 'MATIC',
}

export enum STATE {
    PROCESSING = 'PROCESSING',
    ACCEPTED = 'ACCEPTED',
    CANCELLED = 'CANCELLED',
    REJECTED = 'REJECTED',
    TRAVEL_RULE_SUSPECTED = 'TRAVEL_RULE_SUSPECTED',
    REFUNDING = 'REFUNDING',
    REFUNDED = 'REFUNDED',
}

export enum REQUEST {
    GET = 'get',
    POST = 'post',
}

export enum TransactionStatus {
    PAY = 'PAY',
    EXCEED = 'EXCEED',
    REFUND = 'REFUND',
    ERROR = 'ERROR',
}

export enum PayStatus {
    WAIT = 'WAIT',
    PAY = 'PAY',
}

export enum RefundStatus {
    WAIT = 'WAIT',
    FINISH = 'FINISH',
}
