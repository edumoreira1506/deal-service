import { Request, Response } from 'express'
import { ObjectType } from 'typeorm'
import { BaseController } from '@cig-platform/core'

import i18n from '@Configs/i18n'
import DealRepository from '@Repositories/DealRepository'
import Deal from '@Entities/DealEntity'
import DealBuilder from '@Builders/DealBuilder'

class DealController extends BaseController<Deal, DealRepository>  {
  constructor(repository: ObjectType<Deal>) {
    super(repository)

    this.store = this.store.bind(this)
  }

  @BaseController.errorHandler()
  async store(req: Request, res: Response): Promise<Response> {
    const dealDTO = await new DealBuilder(this.repository)
      .setAdvertisingId(req.body.advertisingId)
      .setBuyerId(req.body.buyerId)
      .setSellerId(req.body.sellerId)
      .build()

    const deal = await this.repository.save(dealDTO)

    return BaseController.successResponse(res, { deal, message: i18n.__('messages.success') })
  }
}

export default new DealController(DealRepository)
