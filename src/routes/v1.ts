import express from 'express'
import { withBodyValidation } from '@cig-platform/core'

import DealController from '@Controllers/DealController'

import { storeDealSchema } from '@Schemas/DealSchemas'
import { storeDealEventSchema } from '@Schemas/DealEventSchemas'

import withDealParam from '@Middlewares/withDealParam'
import DealEventController from '@Controllers/DealEventController'

const router = express.Router()

router.post('/deals', withBodyValidation(storeDealSchema), DealController.store)
router.get('/deals', DealController.index)

router.post(
  '/deals/:dealId/events',
  withBodyValidation(storeDealEventSchema),
  withDealParam,
  DealEventController.store
)

export default router
