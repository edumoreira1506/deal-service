import { NextFunction, Response } from 'express'
import { ApiError, BaseController, NotFoundError, withRequestParam } from '@cig-platform/core'

import DealController from '@Controllers/DealController'
import DealRepository from '@Repositories/DealRepository'
import Deal from '@Entities/DealEntity'
import { RequestWithDeal } from '@Types/requests'
import CancelledDealError from '@Errors/CancelledDealError'
import FinishedDealError from '@Errors/FinishedDealError'

export const withNotFinishedDealParam =
  (errorCallback: (res: Response, error: ApiError) => Response) =>
    (req: RequestWithDeal, res: Response, next: NextFunction) => {
      return withRequestParam<DealRepository, Deal>('dealId', 'deal', DealController, errorCallback)(req, res, () => {
        try {
          if (!req.deal) throw new NotFoundError()
          if (req.deal.cancelled) throw new CancelledDealError()
          if (req.deal.finished) throw new FinishedDealError()

          next()
        } catch (error: any) {
          return errorCallback(res, error?.getError?.() ?? error)
        }
      })
    }

export default withRequestParam<DealRepository, Deal>('dealId', 'deal', DealController, BaseController.errorResponse)
