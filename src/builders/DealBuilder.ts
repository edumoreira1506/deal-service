import { ValidationError, AdvertisingServiceClient } from '@cig-platform/core'

import i18n from '@Configs/i18n'
import { ADVERTISING_SERVICE_URL } from '@Constants/url'
import Deal from '@Entities/DealEntity'
import DealRepository from '@Repositories/DealRepository'

export default class DealBuilder {
  private _advertisingId = '';
  private _buyerId = '';
  private _sellerId = '';
  private _dealRepository: DealRepository;

  constructor(dealRepository: DealRepository) {
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
    const advertisingServiceClient = new AdvertisingServiceClient(ADVERTISING_SERVICE_URL)
    const seller = await advertisingServiceClient.getMerchant(this._sellerId)
    const buyer = await advertisingServiceClient.getMerchant(this._buyerId)
    const advertising = await advertisingServiceClient.getAdvertising(this._sellerId, this._advertisingId)
    const dealWithSameAdvertisingId = await this._dealRepository.findByAdvertisingId(this._advertisingId)

    if (!seller) throw new ValidationError(i18n.__('deal.errors.invalid-seller'))
    if (!buyer) throw new ValidationError(i18n.__('deal.errors.invalid-buyer'))
    if (!advertising) throw new ValidationError(i18n.__('deal.errors.invalid-advertising'))
    if (dealWithSameAdvertisingId.length) throw new ValidationError(i18n.__('deal.errors.already-bought'))
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
