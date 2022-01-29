import { Request } from 'express'

import Deal from '@Entities/DealEntity'

export interface RequestWithDeal extends Request {
  deal?: Deal;
}
