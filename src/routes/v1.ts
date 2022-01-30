import express from 'express'
import { withBodyValidation } from '@cig-platform/core'

import DealController from '@Controllers/DealController'

import { storeDealSchema, updateDealSchema } from '@Schemas/DealSchemas'
import { storeDealEventSchema } from '@Schemas/DealEventSchemas'

import withDealParam, { withNotFinishedDealParam } from '@Middlewares/withDealParam'
import DealEventController from '@Controllers/DealEventController'

const router = express.Router()

router.post('/deals', withBodyValidation(storeDealSchema), DealController.store)

router.get('/deals', DealController.index)

router.get(
  '/deals/:dealId',
  withDealParam,
  DealController.show
)

router.patch(
  '/deals/:dealId',
  withBodyValidation(updateDealSchema),
  withNotFinishedDealParam,
  DealController.update
)

router.post(
  '/deals/:dealId/events',
  withBodyValidation(storeDealEventSchema),
  withNotFinishedDealParam,
  DealEventController.store
)

router.get(
  '/deals/:dealId/events',
  withDealParam,
  DealEventController.index
)

export default router
