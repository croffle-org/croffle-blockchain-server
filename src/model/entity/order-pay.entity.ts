import { PayStatus, RefundStatus } from 'src/common/const/enum.const';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToOne } from 'typeorm';
import { Order } from 'src/model/entity/order.entity';

@Entity({ name: 'tbl_order_pay' })
export class OrderPay {
    @PrimaryGeneratedColumn()
    sq: number;

    @Column({ type: 'int', nullable: true })
    order_sq: number;

    @Column('text', { nullable: true })
    pay_sq_list: string | null;

    @Column({ type: 'int', default: 0 })
    total_price: number;

    @Column({ type: 'int', default: 0 })
    pay_price: number;

    @Column({ type: 'int', default: 0 })
    refund_price: number;

    @Column({
        type: 'enum',
        enum: PayStatus,
        default: PayStatus.WAIT,
    })
    pay_status: PayStatus;

    @Column({
        type: 'enum',
        enum: RefundStatus,
        default: RefundStatus.WAIT,
    })
    refund_status: RefundStatus;

    @Column('datetime', { nullable: true })
    pay_last_dttm: Date | null;

    @Column('datetime', { nullable: true })
    refund_last_dttm: Date | null;

    @Column({ type: 'tinyint', default: 0 })
    is_cancel: number;

    @CreateDateColumn({ type: 'datetime' })
    insert_dttm: Date;

    @UpdateDateColumn({ type: 'datetime' })
    update_dttm: Date;

    @OneToOne(() => Order, (order) => order.orderPay)
    order: Order;
}
