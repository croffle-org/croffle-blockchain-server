import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { CURRENCY } from 'src/common/const/enum.const';

@Entity({ name: 'tbl_withdraw_list' })
export class WithdrawList {
    @PrimaryGeneratedColumn({ type: 'int', name: 'sq' })
    sq: number;

    @Column({ type: 'enum', enum: CURRENCY, nullable: false })
    currency: CURRENCY;

    @Column({ type: 'varchar', length: 44, nullable: false })
    upbit_address: string;

    @Column({ type: 'varchar', length: 44, nullable: false })
    croffle_address: string;

    @Column({ type: 'decimal', precision: 33, scale: 18, nullable: false })
    amount: string;

    @Column({ type: 'decimal', precision: 33, scale: 18, nullable: false })
    token_amount: string;

    @Column({ type: 'bool', nullable: false, default: false })
    status: boolean;

    @Column({ type: 'varchar', length: 128, nullable: false })
    txid: string;
}
