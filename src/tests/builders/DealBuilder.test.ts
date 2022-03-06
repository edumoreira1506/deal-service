import { advertisingFactory, dealFactory, merchantFactory } from '@cig-platform/factories'

import DealBuilder, { MAX_DEALS_PER_ADVERTISING } from '@Builders/DealBuilder'
import AdvertisingServiceClient from '@Clients/AdvertisingServiceClient'
import i18n from '@Configs/i18n'
import { DealEventValueEnum } from '@cig-platform/enums'

describe('DealBuilder', () => {
  describe('.build', () => {
    it('is a valid deal', async () => {
      const seller = merchantFactory()
      const buyer = merchantFactory()
      const advertising = advertisingFactory()
      const deal = dealFactory({ sellerId: seller.id, buyerId: buyer.id })
      const mockFakeDealRepository: any = {
        findByAdvertisingId: jest.fn().mockResolvedValue([])
      }

      jest.spyOn(AdvertisingServiceClient, 'getMerchant').mockResolvedValue(seller)
      jest.spyOn(AdvertisingServiceClient, 'getAdvertising').mockResolvedValue(advertising)

      const dealBuilder = await new DealBuilder(mockFakeDealRepository)
        .setAdvertisingId(deal.advertisingId)
        .setBuyerId(deal.buyerId)
        .setSellerId(deal.sellerId)

      expect(await dealBuilder.build()).toMatchObject({
        sellerId: deal.sellerId,
        advertisingId: deal.advertisingId,
        buyerId: deal.buyerId,
      })
    })

    it('is an invalid deal if exists more than 30 deals of same advertising', async () => {
      const seller = merchantFactory()
      const buyer = merchantFactory()
      const advertising = advertisingFactory()
      const deal = dealFactory({ sellerId: seller.id, buyerId: buyer.id })
      const mockFakeDealRepository: any = {
        findByAdvertisingId: jest.fn().mockResolvedValue(Array(MAX_DEALS_PER_ADVERTISING).fill(deal))
      }

      jest.spyOn(AdvertisingServiceClient, 'getMerchant').mockResolvedValue(seller)
      jest.spyOn(AdvertisingServiceClient, 'getAdvertising').mockResolvedValue(advertising)

      const dealBuilder = await new DealBuilder(mockFakeDealRepository)
        .setAdvertisingId(deal.advertisingId)
        .setBuyerId(deal.buyerId)
        .setSellerId(deal.sellerId)

      await expect(dealBuilder.build).rejects.toThrow(i18n.__('deal.errors.full'))
    })

    it('is an invalid deal if some deal is already confirmed', async () => {
      const seller = merchantFactory()
      const buyer = merchantFactory()
      const advertising = advertisingFactory()
      const deal = dealFactory({ sellerId: seller.id, buyerId: buyer.id })
      const mockFakeDealRepository: any = {
        findByAdvertisingId: jest.fn().mockResolvedValue([
          {
            ...deal,
            events: [
              {
                value: DealEventValueEnum.placed
              },
              {
                value: DealEventValueEnum.confirmed
              }
            ]
          }
        ])
      }

      jest.spyOn(AdvertisingServiceClient, 'getMerchant').mockResolvedValue(seller)
      jest.spyOn(AdvertisingServiceClient, 'getAdvertising').mockResolvedValue(advertising)

      const dealBuilder = await new DealBuilder(mockFakeDealRepository)
        .setAdvertisingId(deal.advertisingId)
        .setBuyerId(deal.buyerId)
        .setSellerId(deal.sellerId)

      await expect(dealBuilder.build).rejects.toThrow(i18n.__('deal.errors.already-bought'))
    })

    it('is an invalid deal when buyer or seller does not exist', async () => {
      const seller = merchantFactory()
      const buyer = merchantFactory()
      const advertising = advertisingFactory()
      const deal = dealFactory({ sellerId: seller.id, buyerId: buyer.id })
      const mockFakeDealRepository: any = {
        findByAdvertisingId: jest.fn().mockResolvedValue([])
      }

      jest.spyOn(AdvertisingServiceClient, 'getMerchant').mockResolvedValue(null as any)
      jest.spyOn(AdvertisingServiceClient, 'getAdvertising').mockResolvedValue(advertising)

      const dealBuilder = await new DealBuilder(mockFakeDealRepository)
        .setAdvertisingId(deal.advertisingId)
        .setBuyerId(deal.buyerId)
        .setSellerId(deal.sellerId)

      await expect(dealBuilder.build).rejects.toThrow(i18n.__('deal.errors.invalid-seller'))
    })

    it('is an invalid deal when advertising does not exist', async () => {
      const seller = merchantFactory()
      const buyer = merchantFactory()
      const deal = dealFactory({ sellerId: seller.id, buyerId: buyer.id })
      const mockFakeDealRepository: any = {
        findByAdvertisingId: jest.fn().mockResolvedValue([])
      }

      jest.spyOn(AdvertisingServiceClient, 'getMerchant').mockResolvedValue(seller)
      jest.spyOn(AdvertisingServiceClient, 'getAdvertising').mockResolvedValue(null as any)

      const dealBuilder = await new DealBuilder(mockFakeDealRepository)
        .setAdvertisingId(deal.advertisingId)
        .setBuyerId(deal.buyerId)
        .setSellerId(deal.sellerId)

      await expect(dealBuilder.build).rejects.toThrow(i18n.__('deal.errors.invalid-advertising'))
    })
  })
})
