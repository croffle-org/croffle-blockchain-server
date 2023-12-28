import { Expose } from 'class-transformer';

import { AccountWallet } from 'src/model/entity/account-wallet.entity';
import { DepositList } from 'src/model/entity/deposit-list.entity';

export class GetWalletInfoResDTO {
    @Expose({ name: 'walletInfo' })
    walletInfo: AccountWallet;
}

export class GetCroffleAddressResDTO {
    @Expose({ name: 'depositsListWithCroffleAddress' })
    depositsListWithCroffleAddress: DepositList[];
}
