import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToOne, JoinColumn } from 'typeorm';
import { OrderPay } from 'src/model/entity/order-pay.entity';

@Entity({ name: 'tbl_order' })
export class Order {
    @PrimaryGeneratedColumn()
    sq: number;

    @Column()
    account_sq: number;

    @Column({ type: 'varchar', length: 16 })
    order_id: string;

    @Column({ type: 'tinyint', default: 0 })
    is_delete: number;

    @CreateDateColumn({ type: 'datetime' })
    insert_dttm: Date;

    @UpdateDateColumn({ type: 'datetime' })
    update_dttm: Date;

    @OneToOne(() => OrderPay, (orderPay) => orderPay.order, { eager: true })
    @JoinColumn({ name: 'sq', referencedColumnName: 'order_sq' })
    orderPay: OrderPay;
}
