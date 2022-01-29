import { EntityRepository } from 'typeorm'
import { BaseRepository } from '@cig-platform/core'

import DealEvent from '@Entities/DealEventEntity'

@EntityRepository(DealEvent)
export default class DealEventRepository extends BaseRepository<DealEvent> {
}
