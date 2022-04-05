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

  async countDetails({ sellerId, buyerId, advertisingId }: {
    sellerId?: string;
    buyerId?: string;
    advertisingId?: string;
  }) {
    try {
      const dealsAmount = await this.count({
        where: DealRepository.createWhere({ sellerId, buyerId, advertisingId }),
      })

      return { pages: Math.ceil(dealsAmount / ITEMS_PER_PAGE), total: dealsAmount }
    } catch {
      return { pages: 0, total: 0 }
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
