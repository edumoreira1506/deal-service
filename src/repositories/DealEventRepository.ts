import { BaseRepositoryFunctionsGenerator } from '@cig-platform/core'
import { dataSource } from '@Configs/database'

import DealEvent from '@Entities/DealEventEntity'

const BaseRepository = BaseRepositoryFunctionsGenerator<DealEvent>()

const DealEventRepository = dataSource.getRepository(DealEvent).extend({
  ...BaseRepository,

  findByDealId(dealId: string) {
    return this.find({
      where: { dealId }
    })
  }
})

export default DealEventRepository
