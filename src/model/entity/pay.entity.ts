import { TransactionStatus } from 'src/common/const/enum.const';
import { Entity, PrimaryGeneratedColumn, Column, UpdateDateColumn, CreateDateColumn } from 'typeorm';

@Entity({ name: 'tbl_pay' })
export class Pay {
    @PrimaryGeneratedColumn()
    sq: number;

    @Column({ type: 'int', nullable: true })
    account_sq: number;

    @Column({ type: 'varchar', length: 42 })
    from_address: string;

    @Column({ type: 'varchar', length: 42 })
    to_address: string;

    @Column({ type: 'varchar', length: 66 })
    txid: string;

    @Column({ type: 'decimal', precision: 28, scale: 18, default: '0.000000000000000000' })
    amount: string;

    @Column({
        type: 'enum',
        enum: TransactionStatus,
        default: TransactionStatus.PAY,
    })
    status: TransactionStatus;

    @CreateDateColumn({ type: 'datetime' })
    insert_dttm: Date;

    @UpdateDateColumn({ type: 'datetime' })
    update_dttm: Date;
}
