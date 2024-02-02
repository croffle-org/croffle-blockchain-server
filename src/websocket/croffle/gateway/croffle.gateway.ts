import { OnModuleInit } from '@nestjs/common';

import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';

import { WithdrawList } from 'src/model/entity/withdraw-list.entity';

import { ConfigService } from '@nestjs/config';

import { DepositService } from 'src/api/deposit/service/deposit.service';
import { OrderService } from 'src/api/order/service/order.service';
import { OrderPayService } from 'src/api/orderPay/service/orderPay.service';
import { WithdrawService } from 'src/api/withdraw/service/withdraw.service';
import { AccountsService } from 'src/api/accounts/service/accounts.service';
import { PayService } from 'src/api/pay/service/pay.service';
import { UpbitService } from 'src/api/upbit/service/upbit.service';
import { Web3Service } from 'src/api/web3/service/web3.service';

import { CURRENCY, PayStatus, TransactionStatus } from 'src/common/const/enum.const';

import { plainToInstance } from 'class-transformer';
import { GetWalletInfoReqDTO } from 'src/api/accounts/dto/accounts.req.dto';
import { WithdrawReqDTO } from 'src/api/upbit/dto/upbit.req.dto';
import { TransferToTotalSupplyManagerReqDTO } from 'src/api/web3/dto/web3.req.dto';
import { GetTotalDepositAmountForTokensReqDTO } from 'src/api/deposit/dto/deposit.req.dto';
import { GetTotalWithdrawAmountForTokensReqDTO, InsertRefundInformationReqDTO } from 'src/api/withdraw/dto/withdraw.req.dto';
import { InsertPayReqDTO } from 'src/api/pay/dto/pay.req.dto';
import { FindOrderWithOrderPayReqDTO } from 'src/api/order/dto/order.req.dto';
import { UpdateOrderPayReqDTO } from 'src/api/orderPay/dto/orderPay.req.dto';

import { GetWalletInfoResDTO } from 'src/api/accounts/dto/accounts.res.dto';
import { InsertPayResDTO } from 'src/api/pay/dto/pay.res.dto';

import { ethers } from 'ethers';
import fs from 'fs';

@WebSocketGateway()
export class CroffleGateway implements OnModuleInit {
    constructor(
        private readonly configService: ConfigService,
        private readonly depositService: DepositService,
        private readonly orderService: OrderService,
        private readonly orderPayService: OrderPayService,
        private readonly withdrawService: WithdrawService,
        private readonly accountsService: AccountsService,
        private readonly payService: PayService,
        private readonly upbitService: UpbitService,
        private readonly web3Service: Web3Service,
    ) {}

    @WebSocketServer() server: Server;
    private readonly CROFFLE_CHAIN_WEBSOCKET_RPC: string = this.configService.get<string>('CROFFLE_CHAIN_WEBSOCKET_RPC');
    private readonly PROXY_CONTRACT: string = this.configService.get<string>('PROXY_CONTRACT');
    private readonly CROFFLE_REFUND_WALLET: string = this.configService.get<string>('CROFFLE_REFUND_WALLET');
    private readonly CROFFLE_PAYMENT_WALLET: string = this.configService.get<string>('CROFFLE_PAYMENT_WALLET');

    private readonly provider: ethers.WebSocketProvider = new ethers.WebSocketProvider(this.CROFFLE_CHAIN_WEBSOCKET_RPC);
    private readonly abi: any[] = JSON.parse(fs.readFileSync(`src/config/abi/CroffleStableTokenV1.abi.json`, 'utf8'));
    private readonly contract: ethers.Contract = new ethers.Contract(this.PROXY_CONTRACT, this.abi, this.provider);

    async subscribeCroffleDeposit() {
        this.contract.on('Transfer', async (from, to, value, event) => {
            if (to === this.CROFFLE_REFUND_WALLET) {
                // CFL 환불 프로세스
                const getWalletInfoReqDTO = plainToInstance(GetWalletInfoReqDTO, { croffle_address: from, currency: CURRENCY.MATIC }, { exposeUnsetFields: false });
                const getWalletInfoResDTO: GetWalletInfoResDTO = await this.accountsService.getWalletInfo(getWalletInfoReqDTO);

                let totalAmount;
                let totalTokenAmount;

                const getTotalDepositAmountForTokensReqDTO = plainToInstance(GetTotalDepositAmountForTokensReqDTO, { croffle_address: from, currency: CURRENCY.MATIC }, { exposeUnsetFields: false });
                const deposit = await this.depositService.getTotalDepositAmountForTokens(getTotalDepositAmountForTokensReqDTO);

                const getTotalWithdrawAmountForTokensReqDTO = plainToInstance(GetTotalWithdrawAmountForTokensReqDTO, { croffle_address: from, currency: CURRENCY.MATIC }, { exposeUnsetFields: false });
                const withdraw = await this.withdrawService.getTotalWithdrawAmountForTokens(getTotalWithdrawAmountForTokensReqDTO);

                if (deposit.totalAmount && withdraw.totalAmount) {
                    totalAmount = deposit.totalAmount - withdraw.totalAmount;
                    totalTokenAmount = deposit.totalTokenAmount - withdraw.totalTokenAmount;
                } else {
                    totalAmount = deposit.totalAmount;
                    totalTokenAmount = deposit.totalTokenAmount;
                }

                const refundRatio: number = Number(ethers.formatEther(value)) / totalAmount;
                const refundTokenAmount: string = (totalTokenAmount * refundRatio).toString();

                const withdrawList = plainToInstance(
                    WithdrawList,
                    {
                        currency: CURRENCY.MATIC,
                        upbit_address: getWalletInfoResDTO.walletInfo.upbit_address,
                        croffle_address: from,
                        amount: ethers.formatEther(value),
                        token_amount: refundTokenAmount,
                        status: getWalletInfoResDTO.walletInfo.withdrawal_allowed_address ? true : false,
                        txid: event.log.transactionHash,
                    },
                    { exposeUnsetFields: false },
                );

                if (getWalletInfoResDTO.walletInfo.withdrawal_allowed_address) {
                    const withdrawReqDTO = plainToInstance(WithdrawReqDTO, { currency: CURRENCY.MATIC, amount: refundTokenAmount, address: getWalletInfoResDTO.walletInfo.upbit_address }, { exposeUnsetFields: false });
                    await this.upbitService.withdraw(withdrawReqDTO);

                    const transferToTotalSupplyManagerReqDTO = plainToInstance(TransferToTotalSupplyManagerReqDTO, { amount: totalAmount }, { exposeUnsetFields: false });
                    await this.web3Service.transferToTotalSupplyManager(transferToTotalSupplyManagerReqDTO);
                }

                const insertRefundInformationReqDTO = plainToInstance(InsertRefundInformationReqDTO, { withdrawList }, { exposeUnsetFields: false });
                await this.withdrawService.insertRefundInformation(insertRefundInformationReqDTO);
            } else if (to === this.CROFFLE_PAYMENT_WALLET) {
                // 상품 구매 프로세스
                const getWalletInfoReqDTO = plainToInstance(GetWalletInfoReqDTO, { croffle_address: from, currency: CURRENCY.MATIC }, { exposeUnsetFields: false });
                const getWalletInfoResDTO: GetWalletInfoResDTO = await this.accountsService.getWalletInfo(getWalletInfoReqDTO);

                const insertPayReqDTO = plainToInstance(
                    InsertPayReqDTO,
                    {
                        pay: {
                            account_sq: getWalletInfoResDTO.walletInfo.sq,
                            from_address: from,
                            to_address: to,
                            txid: event.log.transactionHash,
                            amount: ethers.formatEther(value),
                        },
                    },
                    { exposeUnsetFields: false },
                );
                const insertPayResDTO: InsertPayResDTO = await this.payService.insertPay(insertPayReqDTO);

                const findOrderWithOrderPayReqDTO = plainToInstance(FindOrderWithOrderPayReqDTO, { account_sq: getWalletInfoResDTO.walletInfo.sq }, { exposeUnsetFields: false });
                const findOrderWithOrderPayResDTO = await this.orderService.findOrderWithOrderPay(findOrderWithOrderPayReqDTO);

                const updateOrderPayReqDTO = plainToInstance(UpdateOrderPayReqDTO, {
                    order_pay_sq: findOrderWithOrderPayResDTO.orderPay.sq,
                    pay_sq_list: findOrderWithOrderPayResDTO.orderPay.pay_sq_list === null ? insertPayResDTO.pay.sq.toString() : (findOrderWithOrderPayResDTO.orderPay.pay_sq_list += `,${insertPayResDTO.pay.sq}`),
                    pay_price: findOrderWithOrderPayResDTO.orderPay.pay_price + Number(ethers.formatEther(value)),
                    pay_status: findOrderWithOrderPayResDTO.orderPay.pay_price + Number(ethers.formatEther(value)) >= findOrderWithOrderPayResDTO.orderPay.total_price ? PayStatus.PAY : PayStatus.WAIT,
                });
                await this.orderPayService.updateOrderPay(updateOrderPayReqDTO);

                if (findOrderWithOrderPayResDTO.orderPay.pay_price + Number(ethers.formatEther(value)) > findOrderWithOrderPayResDTO.orderPay.total_price) {
                    // TODO : 초과 토큰 환불 추가
                    const exceedAmount = findOrderWithOrderPayResDTO.orderPay.pay_price + Number(ethers.formatEther(value)) - findOrderWithOrderPayResDTO.orderPay.total_price;

                    const exceedAmountInsertPayReqDTO = plainToInstance(
                        InsertPayReqDTO,
                        {
                            pay: {
                                account_sq: getWalletInfoResDTO.walletInfo.sq,
                                from_address: to,
                                to_address: from,
                                txid: event.log.transactionHash,
                                amount: exceedAmount,
                                status: TransactionStatus.EXCEED,
                            },
                        },
                        { exposeUnsetFields: false },
                    );

                    await this.payService.insertPay(exceedAmountInsertPayReqDTO);
                }
            }
        });
    }

    async onModuleInit() {
        await this.subscribeCroffleDeposit();
    }
}
