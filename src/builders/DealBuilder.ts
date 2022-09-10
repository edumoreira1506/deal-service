import { ValidationError } from '@cig-platform/core'

import i18n from '@Configs/i18n'
import AdvertisingServiceClient from '@Clients/AdvertisingServiceClient'
import Deal from '@Entities/DealEntity'
import DealRepository from '@Repositories/DealRepository'
import { DealEventValueEnum } from '@cig-platform/enums'

export const MAX_DEALS_PER_ADVERTISING = 30

export default class DealBuilder {
  private _advertisingId = ''
  private _buyerId = ''
  private _sellerId = ''
  private _dealRepository: typeof DealRepository

  constructor(dealRepository: typeof DealRepository) {
    this._dealRepository = dealRepository
  }

  setAdvertisingId(advertisingId: string): DealBuilder {
    this._advertisingId = advertisingId

    return this
  }

  setBuyerId(buyerId: string): DealBuilder {
    this._buyerId = buyerId

    return this
  }

  setSellerId(sellerId: string): DealBuilder {
    this._sellerId = sellerId

    return this
  }

  validate = async () => {
    const seller = await AdvertisingServiceClient.getMerchant(this._sellerId)
    const buyer = await AdvertisingServiceClient.getMerchant(this._buyerId)
    const advertising = await AdvertisingServiceClient.getAdvertising(this._sellerId, this._advertisingId)
    const deals = await this._dealRepository.findByAdvertisingId(this._advertisingId)

    if (!seller) throw new ValidationError(i18n.__('deal.errors.invalid-seller'))
    if (!buyer) throw new ValidationError(i18n.__('deal.errors.invalid-buyer'))
    if (!advertising) throw new ValidationError(i18n.__('deal.errors.invalid-advertising'))

    const hasConfirmedDeals = deals.some(deal =>
      deal?.events?.some(e => e.value === DealEventValueEnum.confirmed) &&
      deal?.events?.every(e => e.value !== DealEventValueEnum.cancelled) &&
      deal?.events?.every(e => e.value !== DealEventValueEnum.received)
    )

    if (hasConfirmedDeals) throw new ValidationError(i18n.__('deal.errors.already-bought'))
    if (deals.length >= MAX_DEALS_PER_ADVERTISING) throw new ValidationError(i18n.__('deal.errors.full'))
  }


  build = async (): Promise<Deal> => {
    await this.validate()

    const deal = new Deal()

    deal.sellerId = this._sellerId
    deal.advertisingId = this._advertisingId
    deal.buyerId = this._buyerId

    return deal
  }
}
