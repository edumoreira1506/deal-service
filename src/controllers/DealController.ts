import { Request, Response } from 'express'
import { BaseController, NotFoundError } from '@cig-platform/core'

import i18n from '@Configs/i18n'
import DealRepository from '@Repositories/DealRepository'
import DealBuilder from '@Builders/DealBuilder'
import { RequestWithDeal } from '@Types/requests'

class DealController {
  private repository: typeof DealRepository

  constructor(_repository: typeof DealRepository) {
    this.repository = _repository

    this.store = this.store.bind(this)
    this.index = this.index.bind(this)
    this.update = this.update.bind(this)
    this.show = this.show.bind(this)
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

  @BaseController.errorHandler()
  @BaseController.actionHandler(i18n.__('messages.updated'))
  async update(req: Request): Promise<void> {
    const dealId = req.params.dealId

    await this.repository.updateById(dealId, {
      finished: req.body?.finished ?? false,
      cancelled: req.body?.cancelled ?? false,
    })
  }

  @BaseController.errorHandler()
  async show(req: RequestWithDeal, res: Response) {
    const deal = req.deal

    if (!deal) throw new NotFoundError()

    return BaseController.successResponse(res, { deal })
  }

  @BaseController.errorHandler()
  async index(req: Request, res: Response): Promise<Response> {
    const sellerId = String(req?.query?.sellerId ?? '')
    const buyerId = String(req?.query?.buyerId ?? '')
    const page = Number(req?.query?.page ?? 0)
    const advertisingId = String(req?.query?.advertisingId ?? '')
    const { pages, total } = await this.repository.countDetails({ sellerId, buyerId, advertisingId })
    const deals = await this.repository.search({ sellerId, buyerId, advertisingId, page })

    return BaseController.successResponse(res, { total, pages, deals, message: i18n.__('messages.success') })
  }
}

export default new DealController(DealRepository)
