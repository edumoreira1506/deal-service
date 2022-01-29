import express from 'express'
import { withBodyValidation } from '@cig-platform/core'

import DealController from '@Controllers/DealController'
import { storeDealSchema } from '@Schemas/DealSchemas'

const router = express.Router()

router.post('/deals', withBodyValidation(storeDealSchema), DealController.store)

export default router
