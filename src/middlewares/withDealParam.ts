import { NextFunction, Response } from 'express'
import {  BaseController, NotFoundError, withRequestParam } from '@cig-platform/core'

import DealController from '@Controllers/DealController'
import DealRepository from '@Repositories/DealRepository'
import Deal from '@Entities/DealEntity'
import { RequestWithDeal } from '@Types/requests'
import CancelledDealError from '@Errors/CancelledDealError'
import FinishedDealError from '@Errors/FinishedDealError'

export const withNotFinishedDealParam =
    (req: RequestWithDeal, res: Response, next: NextFunction) =>
      withRequestParam<DealRepository, Deal>('dealId', 'deal', DealController, BaseController.errorResponse)(req, res, () => {
        try {
          if (!req.deal) throw new NotFoundError()
          if (req.deal.cancelled) throw new CancelledDealError()
          if (req.deal.finished) throw new FinishedDealError()

          next()
        } catch (error: any) {
          return BaseController.errorResponse(res, error?.getError?.() ?? error)
        }
      })

export default withRequestParam<DealRepository, Deal>('dealId', 'deal', DealController, BaseController.errorResponse)
