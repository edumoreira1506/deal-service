import express from 'express'
import { withBodyValidation } from '@cig-platform/core'

import DealController from '@Controllers/DealController'

import { storeDealSchema, updateDealSchema } from '@Schemas/DealSchemas'
import { storeDealEventSchema } from '@Schemas/DealEventSchemas'

import withDealParam, { withNotFinishedDealParam } from '@Middlewares/withDealParam'
import DealEventController from '@Controllers/DealEventController'
import withApiKey from '@Middlewares/withApiKey'

const router = express.Router()

router.post('/deals', withApiKey, withBodyValidation(storeDealSchema), DealController.store)

router.get('/deals', withApiKey, DealController.index)

router.get(
  '/deals/:dealId',
  withApiKey,
  withDealParam,
  DealController.show
)

router.patch(
  '/deals/:dealId',
  withApiKey,
  withBodyValidation(updateDealSchema),
  withNotFinishedDealParam,
  DealController.update
)

router.post(
  '/deals/:dealId/events',
  withApiKey,
  withBodyValidation(storeDealEventSchema),
  withNotFinishedDealParam,
  DealEventController.store
)

router.get(
  '/deals/:dealId/events',
  withApiKey,
  withDealParam,
  DealEventController.index
)

export default router
