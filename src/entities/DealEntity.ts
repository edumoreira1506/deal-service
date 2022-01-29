import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm'

@Entity('deals')
export default class DealEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', name: 'advertising_id' })
  advertisingId: string;

  @Column('boolean')
  active: boolean;

  @Column('boolean')
  finished: boolean;

  @Column('boolean')
  cancelled: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @Column({ type: 'uuid', name: 'buyer_id' })
  buyerId: string;

  @Column({ type: 'uuid', name: 'seller_id' })
  sellerId: string;
}
