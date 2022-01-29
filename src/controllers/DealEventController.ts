import { Request, Response } from 'express'
import { ObjectType } from 'typeorm'
import { BaseController } from '@cig-platform/core'

import i18n from '@Configs/i18n'
import DealEventRepository from '@Repositories/DealEventRepository'
import DealEvent from '@Entities/DealEventEntity'
import DealEventBuilder from '@Builders/DealEventBuilder'

class DealEventController extends BaseController<DealEvent, DealEventRepository>  {
  constructor(repository: ObjectType<DealEvent>) {
    super(repository)

    this.store = this.store.bind(this)
    this.index = this.index.bind(this)
  }

  @BaseController.errorHandler()
  async store(req: Request, res: Response): Promise<Response> {
    const dealEventDTO = new DealEventBuilder()
      .setDealId(req.params.dealId)
      .setMetadata(req.body.metadata)
      .setValue(req.body.value)
      .build()

    const event = await this.repository.save(dealEventDTO)

    return BaseController.successResponse(res, { event, message: i18n.__('messages.success') })
  }

  @BaseController.errorHandler()
  async index(req: Request, res: Response): Promise<Response> {
    const dealId = req.params.dealId
    const events = await this.repository.findByDealId(dealId)

    return BaseController.successResponse(res, { events, message: i18n.__('messages.success') })
  }
}

export default new DealEventController(DealEventRepository)
