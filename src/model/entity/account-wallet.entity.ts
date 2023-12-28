import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { CURRENCY } from 'src/common/const/enum.const';

@Entity({ name: 'tbl_account_wallet' })
export class AccountWallet {
    @PrimaryGeneratedColumn({ type: 'int', name: 'sq' })
    sq: number;

    @Column({ type: 'enum', enum: CURRENCY, nullable: false })
    currency: CURRENCY;

    @Column({ type: 'varchar', length: 300, nullable: false })
    upbit_address: string;

    @Column({ type: 'varchar', length: 300, nullable: false })
    croffle_address: string;

    @Column({ type: 'bool', nullable: false, default: false })
    withdrawal_allowed_address: boolean;
}
