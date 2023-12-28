import { Column, Entity, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { CURRENCY, STATE } from 'src/common/const/enum.const';

@Entity({ name: 'tbl_deposit_list' })
@Unique(['txid'])
export class DepositList {
    @PrimaryGeneratedColumn({ type: 'int', name: 'sq' })
    sq: number;

    @Column({ type: 'enum', enum: CURRENCY, nullable: false })
    currency: CURRENCY;

    @Column({ type: 'varchar', length: 128, nullable: false })
    txid: string;

    @Column({ type: 'enum', enum: STATE, nullable: false })
    state: STATE;

    @Column({ type: 'varchar', length: 40, nullable: false })
    created_at: string;

    @Column({ type: 'varchar', length: 40, nullable: false })
    done_at: string;

    @Column({ type: 'decimal', precision: 33, scale: 18, nullable: false })
    amount: string;

    @Column({ type: 'int', nullable: false, default: 0 })
    token_price: number;

    @Column({ type: 'int', nullable: false, default: 0 })
    krw_amount: number;

    @Column({ type: 'varchar', length: 44, nullable: false })
    upbit_address: string;

    @Column({ type: 'varchar', length: 44, nullable: false })
    croffle_address: string;

    @Column({ type: 'bool', nullable: false, default: false })
    status: boolean;
}
