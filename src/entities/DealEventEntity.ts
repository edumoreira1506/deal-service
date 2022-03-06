import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm'

import Deal from './DealEntity'

@Entity('deal_events')
export default class DealEventEntity {
  @PrimaryGeneratedColumn('uuid')
    id: string

  @Column({ type: 'uuid', name: 'deal_id' })
    dealId: string

  @Column('boolean')
    active: boolean

  @Column('varchar')
    value: string

  @Column('json')
    metadata?: Record<string, any>

  @CreateDateColumn({ name: 'created_at' })
    createdAt: Date

  @ManyToOne(() => Deal, deal => deal.events)
  @JoinColumn({ name: 'deal_id' })
    deal: Deal
}
