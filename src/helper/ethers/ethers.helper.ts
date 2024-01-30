import { Inject, Injectable } from '@nestjs/common';

import { ConfigService } from '@nestjs/config';

import { plainToInstance } from 'class-transformer';
import { ConnectContractWithWalletReqDTO, SendTransactionReqDTO } from 'src/helper/ethers/dto/ethers.req.dto';
import { AdjustTotalSupplyReqDTO, TransferToTotalSupplyManagerReqDTO, TransferToUserReqDTO } from 'src/api/web3/dto/web3.req.dto';

import { ResImpl } from 'src/common/res/res.implement';
import { ADJUST_TOTALSUPPLY_FAILED, GET_TOTALSUPPLY_FAILED, SEND_TRANSACTION_FAILED, TRANSFER_TO_TOTALSUPPLY_MANAGER_FAILED, TRANSFER_TO_USER_FAILED } from 'src/common/const/error.const';

import { METHODS } from 'src/common/const/enum.const';

import { ethers } from 'ethers';
import fs from 'fs';
import { CustomLogger } from 'src/config/logger/custom.logger.config';

@Injectable()
export class EthersHelper {
    constructor(
        @Inject('CROFFLE_BLOCKCHAIN_SERVER_LOG')
        private readonly logger: CustomLogger,
        private readonly configService: ConfigService,
    ) {}

    private readonly CROFFLE_TOTALSUPPLY_MANAGER: string = this.configService.get<string>('CROFFLE_TOTALSUPPLY_MANAGER');
    private readonly CROFFLE_TOTALSUPPLY_MANAGER_PRIVATEKEY: string = this.configService.get<string>('CROFFLE_TOTALSUPPLY_MANAGER_PRIVATEKEY');
    private readonly CROFFLE_PROPOSED_OWNER_PRIVATEKEY: string = this.configService.get<string>('CROFFLE_PROPOSED_OWNER_PRIVATEKEY');

    private readonly CROFFLE_CHAIN_RPC: string = this.configService.get<string>('CROFFLE_CHAIN_RPC');
    private readonly PROXY_CONTRACT: string = this.configService.get<string>('PROXY_CONTRACT');

    private readonly provider: ethers.JsonRpcProvider = new ethers.JsonRpcProvider(this.CROFFLE_CHAIN_RPC);
    private readonly abi: any[] = JSON.parse(fs.readFileSync(`src/config/abi/CroffleStableTokenV1.abi.json`, 'utf8'));
    private readonly contract: ethers.Contract = new ethers.Contract(this.PROXY_CONTRACT, this.abi, this.provider);

    private connectContractWithWallet(connectContractWithWalletReqDTO: ConnectContractWithWalletReqDTO): ethers.BaseContract {
        const wallet = new ethers.Wallet(connectContractWithWalletReqDTO.privateKey, this.provider);
        return this.contract.connect(wallet);
    }

    private async sendTransaction(sendTransactionReqDTO: SendTransactionReqDTO): Promise<void> {
        try {
            const connectContractWithWalletReqDTO = plainToInstance(ConnectContractWithWalletReqDTO, { privateKey: sendTransactionReqDTO.privateKey }, { exposeUnsetFields: false });
            const contractWithSigner = this.connectContractWithWallet(connectContractWithWalletReqDTO);

            const transaction = await contractWithSigner[sendTransactionReqDTO.method](...sendTransactionReqDTO.params, { gasLimit: 300000 });
            await transaction.wait();
        } catch (error) {
            throw new ResImpl(SEND_TRANSACTION_FAILED);
        }
    }

    public async getTotalSupply(): Promise<number> {
        try {
            const totalSupply: bigint = await this.contract.totalSupply();
            return Math.floor(Number(ethers.formatEther(totalSupply)));
        } catch (error) {
            this.logger.logError(this.constructor.name, this.getTotalSupply.name, error);
            throw new ResImpl(GET_TOTALSUPPLY_FAILED);
        }
    }

    public async adjustTotalSupply(adjustTotalSupplyReqDTO: AdjustTotalSupplyReqDTO): Promise<void> {
        const sendTransactionReqDTO = plainToInstance(
            SendTransactionReqDTO,
            {
                privateKey: this.CROFFLE_TOTALSUPPLY_MANAGER_PRIVATEKEY,
                method: adjustTotalSupplyReqDTO.increase ? METHODS.INCREASE_TOTALSUPPLY : METHODS.DECREASE_TOTALSUPPLY,
                params: [ethers.parseUnits(adjustTotalSupplyReqDTO.amount.toString(), 'ether')],
            },
            { exposeUnsetFields: false },
        );

        try {
            await this.sendTransaction(sendTransactionReqDTO);
        } catch (error) {
            this.logger.logError(this.constructor.name, this.adjustTotalSupply.name, error);
            throw new ResImpl(ADJUST_TOTALSUPPLY_FAILED);
        }
    }

    public async transferToUser(transferToUserReqDTO: TransferToUserReqDTO): Promise<void> {
        const sendTransactionReqDTO = plainToInstance(
            SendTransactionReqDTO,
            {
                privateKey: this.CROFFLE_TOTALSUPPLY_MANAGER_PRIVATEKEY,
                method: METHODS.TRANSFER,
                params: [transferToUserReqDTO.deposit.croffle_address, ethers.parseUnits(transferToUserReqDTO.deposit.krw_amount.toString(), 'ether')],
            },
            { exposeUnsetFields: false },
        );

        try {
            await this.sendTransaction(sendTransactionReqDTO);
        } catch (error) {
            this.logger.logError(this.constructor.name, this.transferToUser.name, error);
            throw new ResImpl(TRANSFER_TO_USER_FAILED);
        }
    }

    public async transferToTotalSupplyManager(transferToTotalSupplyManagerReqDTO: TransferToTotalSupplyManagerReqDTO): Promise<void> {
        const sendTransactionReqDTO = plainToInstance(
            SendTransactionReqDTO,
            {
                privateKey: this.CROFFLE_PROPOSED_OWNER_PRIVATEKEY,
                method: METHODS.TRANSFER,
                params: [this.CROFFLE_TOTALSUPPLY_MANAGER, ethers.parseUnits(transferToTotalSupplyManagerReqDTO.amount, 'ether')],
            },
            { exposeUnsetFields: false },
        );

        try {
            await this.sendTransaction(sendTransactionReqDTO);
        } catch (error) {
            this.logger.logError(this.constructor.name, this.transferToTotalSupplyManager.name, error);
            throw new ResImpl(TRANSFER_TO_TOTALSUPPLY_MANAGER_FAILED);
        }
    }
}
