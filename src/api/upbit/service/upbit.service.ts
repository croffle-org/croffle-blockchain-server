import { Inject, Injectable } from '@nestjs/common';

import { DepositList } from 'src/model/entity/deposit-list.entity';

import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

import { AxiosHelper } from 'src/helper/axios/axios.helper';

import { ResImpl } from 'src/common/res/res.implement';
import { GET_ACCESS_TOKEN_FAILED, GET_KRW_BALANCE_FAILED, GET_TOKEN_DEPOSITS_FAILED, GET_TOKEN_PRICE_FAILED, GET_TRANSACTION_DETAIL_FAILED, SET_ACCESS_TOKEN_FAILED, TOKEN_WITHDRAW_FAILED } from 'src/common/const/error.const';

import { plainToInstance } from 'class-transformer';

import { GetTransactionFromAddressReqDTO, SetUpbitJwtReqDTO, WithdrawReqDTO } from 'src/api/upbit/dto/upbit.req.dto';
import { GetKrwAmountResDTO, GetMaticPriceResDTO, GetRecentUpbitMaticDepositsResDTO, GetTransactionFromAddressResDTO, SetUpbitJwtResDTO } from 'src/api/upbit/dto/upbit.res.dto';
import { AixosGetRequestReqDTO, UpbitGetRequestReqDTO, UpbitPostRequestReqDTO } from 'src/helper/axios/dto/axios.req.dto';

@Injectable()
export class UpbitService {
    constructor(@Inject(CACHE_MANAGER) private readonly cacheManager: Cache, private readonly axiosHelper: AxiosHelper) {}

    /**
     * @dev Retrieves the Upbit JWT (JSON Web Token) from the cache manager.
     *
     * @returns {Promise<SetUpbitJwtResDTO>} An object containing the Upbit JWT.
     * @returns {string} SetUpbitJwtResDTO.token - The JWT retrieved from the cache manager.
     */
    public async getUpbitJwt(): Promise<SetUpbitJwtResDTO> {
        try {
            const token = await this.cacheManager.get('token');
            return plainToInstance(SetUpbitJwtResDTO, { token }, { exposeUnsetFields: false });
        } catch (error) {
            console.error(error.message);
            throw new ResImpl(SET_ACCESS_TOKEN_FAILED);
        }
    }

    /**
     * @dev Stores the Upbit JWT (JSON Web Token) into the cache manager.
     *
     * @param {SetUpbitJwtReqDTO} setUpbitJwtReqDTO - An object containing the JWT to be stored.
     * @param {string} setUpbitJwtReqDTO.token - The JWT that needs to be stored in the cache manager.
     */
    public async setUpbitJwt(setUpbitJwtReqDTO: SetUpbitJwtReqDTO): Promise<void> {
        try {
            await this.cacheManager.set('token', setUpbitJwtReqDTO.token, 0);
        } catch (error) {
            console.error(error.message);
            throw new ResImpl(GET_ACCESS_TOKEN_FAILED);
        }
    }

    /**
     * @dev Fetches the KRW balance from the Upbit accounts endpoint. Filters the response to obtain only the KRW balance
     *
     * @returns {Promise<GetKrwAmountResDTO>} Returns an object containing the KRW balance.
     * @returns {number} GetKrwAmountResDTO.amount - The rounded-down KRW balance.
     */
    public async getKrwAmount(): Promise<GetKrwAmountResDTO> {
        try {
            const upbitGetRequestReqDTO = plainToInstance(UpbitGetRequestReqDTO, { endpoint: '/accounts', query: '' }, { exposeUnsetFields: false });
            const response = await this.axiosHelper.upbitGetRequest(upbitGetRequestReqDTO);
            const [result] = response.filter((obj: { [x: string]: string }) => obj['currency'] === 'KRW');

            return plainToInstance(GetKrwAmountResDTO, { amount: Math.floor(result.balance) }, { exposeUnsetFields: false });
        } catch (error) {
            console.error(error.message);
            throw new ResImpl(GET_KRW_BALANCE_FAILED);
        }
    }

    /**
     * @dev Fetches the current price of MATIC in KRW from the Upbit ticker endpoint.
     *
     * @returns {Promise<GetMaticPriceResDTO>} Returns an object containing the price of MATIC in KRW.
     * @returns {number} GetMaticPriceResDTO.token_price - The price of MATIC in KRW.
     */
    public async getMaticPrice(): Promise<GetMaticPriceResDTO> {
        try {
            const upbitGetRequestReqDTO = plainToInstance(UpbitGetRequestReqDTO, { endpoint: '/ticker', query: 'markets=KRW-MATIC' }, { exposeUnsetFields: false });
            const [response] = await this.axiosHelper.upbitGetRequest(upbitGetRequestReqDTO);

            return plainToInstance(GetMaticPriceResDTO, { token_price: response.trade_price }, { exposeUnsetFields: false });
        } catch (error) {
            console.error(error.message);
            throw new ResImpl(GET_TOKEN_PRICE_FAILED);
        }
    }

    /**
     * @dev Fetches transaction details using the Upbit API and enriches the provided deposit list with the 'from' address of each transaction.
     *
     * @param {GetTransactionFromAddressReqDTO} getTransactionFromAddressReqDTO - Object containing the deposit list to be enriched.
     * @param {DepositList[]} getTransactionFromAddressReqDTO.depositList - List of deposit transactions to be enriched.
     *
     * @returns {Promise<GetTransactionFromAddressResDTO>} Returns an object containing the enriched deposit list.
     * @returns {DepositList[]} GetTransactionFromAddressResDTO.depositsListWithFromAddress - List of deposit transactions enriched with 'from' address.
     */
    public async getTransactionFromAddress(getTransactionFromAddressReqDTO: GetTransactionFromAddressReqDTO): Promise<GetTransactionFromAddressResDTO> {
        const token = await this.getUpbitJwt();
        const depositsListWithFromAddress: DepositList[] = [];

        try {
            for (const deposit of getTransactionFromAddressReqDTO.depositList) {
                const aixosGetRequestReqDTO = plainToInstance(
                    AixosGetRequestReqDTO,
                    {
                        url: `https://ccx.upbit.com/api/v1/transactions/internal?currency=MATIC&txid=${deposit.txid}`,
                        header: { Authorization: `Bearer ${token}` },
                    },
                    { exposeUnsetFields: false },
                );

                const { response: withdraw } = await this.axiosHelper.aixosGetRequest(aixosGetRequestReqDTO);
                depositsListWithFromAddress.push(plainToInstance(DepositList, { ...deposit, upbit_address: withdraw.address }, { exposeUnsetFields: false }));
            }

            return plainToInstance(GetTransactionFromAddressResDTO, { depositsListWithFromAddress }, { exposeUnsetFields: false });
        } catch (error) {
            console.error(error.message);
            throw new ResImpl(GET_TRANSACTION_DETAIL_FAILED);
        }
    }

    /**
     * @dev Retrieves the recent MATIC deposit transactions from Upbit within the last 2 hours.
     *
     * @returns {Promise<GetRecentUpbitMaticDepositsResDTO>} Returns an object containing the filtered list of recent deposits.
     * @returns {DepositList[]} GetRecentUpbitMaticDepositsResDTO.recentDepositList - List of recent MATIC deposit transactions from Upbit.
     */
    public async getRecentUpbitMaticDeposits(): Promise<GetRecentUpbitMaticDepositsResDTO> {
        try {
            const upbitGetRequestReqDTO = plainToInstance(UpbitGetRequestReqDTO, { endpoint: '/deposits', query: 'currency=MATIC' }, { exposeUnsetFields: false });
            const response = await this.axiosHelper.upbitGetRequest(upbitGetRequestReqDTO);

            const recentDepositList = response.filter((transaction) => {
                return transaction.txid.startsWith('upbit') && new Date(transaction.done_at).getTime() > Date.now() - 2 * 60 * 60 * 1000;
            });

            return plainToInstance(GetRecentUpbitMaticDepositsResDTO, { recentDepositList }, { exposeUnsetFields: false });
        } catch (error) {
            console.error(error.message);
            throw new ResImpl(GET_TOKEN_DEPOSITS_FAILED);
        }
    }

    // TODO : net_type 수정
    /**
     * @dev Executes a token withdrawal operation in Upbit using the MATIC network.
     *
     * @param {WithdrawReqDTO} withdrawReqDTO - Object containing withdrawal details.
     * @param {CURRENCY} withdrawReqDTO.currency - Currency type for the withdrawal.
     * @param {string} withdrawReqDTO.amount - Amount of tokens to withdraw.
     * @param {string} withdrawReqDTO.address - Destination address for the withdrawal.
     */
    public async withdraw(withdrawReqDTO: WithdrawReqDTO): Promise<void> {
        const body = {
            currency: withdrawReqDTO.currency,
            net_type: 'MATIC',
            amount: withdrawReqDTO.amount,
            address: withdrawReqDTO.address,
            transaction_type: 'internal',
        };

        try {
            const upbitPostRequestReqDTO = plainToInstance(UpbitPostRequestReqDTO, { endpoint: '/withdraws/coin', body }, { exposeUnsetFields: false });
            await this.axiosHelper.upbitPostRequest(upbitPostRequestReqDTO);
        } catch (error) {
            console.error(error.message);
            throw new ResImpl(TOKEN_WITHDRAW_FAILED);
        }
    }
}
