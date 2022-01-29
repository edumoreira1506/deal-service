import { EntityRepository } from 'typeorm'
import { BaseRepository } from '@cig-platform/core'

import Deal from '@Entities/DealEntity'

@EntityRepository(Deal)
export default class DealRepository extends BaseRepository<Deal> {
  findByAdvertisingId(advertisingId: string) {
    return this.find({
      where: {
        advertisingId,
        cancelled: false,
        active: true,
      }
    })
  }

  search({ sellerId, buyerId }: { sellerId?: string; buyerId?: string } = {}) {
    return this.find({
      where: {
        ...(sellerId ? { sellerId } : {}),
        ...(buyerId ? { buyerId } : {}),
        active: true,
      }
    })
  }
}
