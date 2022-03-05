import { EntityRepository } from 'typeorm'
import { BaseRepository } from '@cig-platform/core'

import Deal from '@Entities/DealEntity'

const ITEMS_PER_PAGE = 30

@EntityRepository(Deal)
export default class DealRepository extends BaseRepository<Deal> {
  findByAdvertisingId(advertisingId: string) {
    return this.find({
      where: {
        advertisingId,
        cancelled: false,
        active: true,
      },
      relations: ['events']
    })
  }

  static createWhere({ sellerId, buyerId, advertisingId }: {
    sellerId?: string;
    buyerId?: string;
    advertisingId?: string;
  }) {
    return {
      ...(sellerId ? { sellerId } : {}),
      ...(buyerId ? { buyerId } : {}),
      ...(advertisingId ? { advertisingId } : {}),
      active: true,
    }
  }

  async countPages({ sellerId, buyerId, advertisingId }: {
    sellerId?: string;
    buyerId?: string;
    advertisingId?: string;
  }) {
    try {
      const deals = await this.count({
        where: DealRepository.createWhere({ sellerId, buyerId, advertisingId }),
      })

      return Math.ceil(deals / ITEMS_PER_PAGE)
    } catch {
      return 0
    }
  }

  async search({ sellerId, buyerId, advertisingId, page = 0 }: {
    sellerId?: string;
    buyerId?: string;
    advertisingId?: string;
    page?: number;
  } = {}) {
    try {
      const deals = await this.find({
        where: DealRepository.createWhere({ sellerId, buyerId, advertisingId }),
        skip: page * ITEMS_PER_PAGE,
        take: ITEMS_PER_PAGE
      })

      return deals
    } catch {
      return []
    }
  }
}
