import { NextFunction, Response } from 'express'
import {  BaseController, NotFoundError, withRequestParam } from '@cig-platform/core'

import Deal from '@Entities/DealEntity'
import { RequestWithDeal } from '@Types/requests'
import CancelledDealError from '@Errors/CancelledDealError'
import FinishedDealError from '@Errors/FinishedDealError'
import DealRepository from '@Repositories/DealRepository'

export const withNotFinishedDealParam =
    (req: RequestWithDeal, res: Response, next: NextFunction) =>
      withRequestParam<Deal>('dealId', 'deal', DealRepository, BaseController.errorResponse)(req, res, () => {
        try {
          if (!req.deal) throw new NotFoundError()
          if (req.deal.cancelled) throw new CancelledDealError()
          if (req.deal.finished) throw new FinishedDealError()

          next()
        } catch (error: any) {
          return BaseController.errorResponse(res, error?.getError?.() ?? error)
        }
      })

export default withRequestParam<Deal>('dealId', 'deal', DealRepository, BaseController.errorResponse)
