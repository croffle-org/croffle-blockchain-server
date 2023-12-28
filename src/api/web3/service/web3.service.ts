import { Injectable } from '@nestjs/common';

import { EthersHelper } from 'src/helper/ethers/ethers.helper';

import { plainToInstance } from 'class-transformer';
import { AdjustTotalSupplyReqDTO, TransferToTotalSupplyManagerReqDTO, TransferToUserReqDTO } from 'src/api/web3/dto/web3.req.dto';
import { GetTotalSupplyResDTO } from 'src/api/web3/dto/web3.res.dto';

@Injectable()
export class Web3Service {
    constructor(private readonly ethersHelper: EthersHelper) {}

    /**
     * @dev Fetches the total supply of the token.
     *
     * @returns {Promise<GetTotalSupplyResDTO>} Returns an object containing the total supply of the token.
     * @returns {number} GetTotalSupplyResDTO.total_supply - Total supply of the token.
     */
    public async getTotalSupply(): Promise<GetTotalSupplyResDTO> {
        const total_supply = await this.ethersHelper.getTotalSupply();
        return plainToInstance(GetTotalSupplyResDTO, { total_supply }, { exposeUnsetFields: false });
    }

    /**
     * @dev Adjusts the total supply of the token.
     *
     * @param {AdjustTotalSupplyReqDTO} adjustTotalSupplyReqDTO - The parameters for adjusting the total supply.
     * @param {number} AdjustTotalSupplyReqDTO.amount - The amount to adjust the total supply by.
     * @param {boolean} AdjustTotalSupplyReqDTO.increase - Indicates if the total supply should be increased (true) or decreased (false).
     *
     */
    public async adjustTotalSupply(adjustTotalSupplyReqDTO: AdjustTotalSupplyReqDTO): Promise<void> {
        await this.ethersHelper.adjustTotalSupply(adjustTotalSupplyReqDTO);
    }

    /**
     * Transfers tokens to a user based on the provided deposit details.
     *
     * @param {TransferToUserReqDTO} transferToUserReqDTO - The parameters for transferring tokens to a user.
     * @param {DepositList} TransferToUserReqDTO.deposit - The deposit details for which tokens need to be transferred.
     */
    public async transferToUser(transferToUserReqDTO: TransferToUserReqDTO): Promise<void> {
        this.ethersHelper.transferToUser(transferToUserReqDTO);
    }

    /**
     * Transfers a specific amount of tokens to the Total Supply Manager.
     *
     * @param {TransferToTotalSupplyManagerReqDTO} transferToTotalSupplyManagerReqDTO - The details for the token transfer.
     * @param {string} TransferToTotalSupplyManagerReqDTO.amount - The amount of tokens to transfer to the Total Supply Manager.
     */
    public async transferToTotalSupplyManager(transferToTotalSupplyManagerReqDTO: TransferToTotalSupplyManagerReqDTO): Promise<void> {
        this.ethersHelper.transferToTotalSupplyManager(transferToTotalSupplyManagerReqDTO);
    }
}
