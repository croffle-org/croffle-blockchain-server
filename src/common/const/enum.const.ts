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
