import request from 'supertest'
import typeorm from 'typeorm'
import { dealFactory, merchantFactory, advertisingFactory } from '@cig-platform/factories'

import App from '@Configs/server'
import AdvertisingServiceClient from '@Clients/AdvertisingServiceClient'
import i18n from '@Configs/i18n'

jest.mock('typeorm', () => ({
  createConnection: jest.fn().mockResolvedValue({}),
  Column: jest.fn(),
  Entity: jest.fn(),
  PrimaryGeneratedColumn: jest.fn(),
  CreateDateColumn: jest.fn(),
  EntityRepository: jest.fn(),
  Repository: jest.fn(),
  getCustomRepository: jest.fn().mockReturnValue({
    save: jest.fn(),
    find: jest.fn(),
  }),
  ManyToOne: jest.fn(),
  JoinColumn: jest.fn(),
  OneToMany: jest.fn(),
}))

describe('Deal actions', () => {
  describe('Register', () => {
    it('is a valid deal', async () => {
      const merchant = merchantFactory()
      const advertising = advertisingFactory()
      const mockFind = jest.fn().mockResolvedValue([])
      const mockGetMerchant = jest.fn().mockResolvedValue(merchant)
      const mockGetAdvertising = jest.fn().mockResolvedValue(advertising)
      const mockSave = jest.fn()

      jest.spyOn(typeorm, 'getCustomRepository').mockReturnValue({
        findByAdvertisingId: mockFind,
        save: mockSave
      })
      jest.spyOn(AdvertisingServiceClient, 'getMerchant').mockImplementation(mockGetMerchant)
      jest.spyOn(AdvertisingServiceClient, 'getAdvertising').mockImplementation(mockGetAdvertising)

      const deal = dealFactory()
      const response = await request(App).post('/v1/deals').send({
        sellerId: deal.sellerId,
        buyerId: deal.buyerId,
        advertisingId: deal.advertisingId,
      })

      expect(response.statusCode).toBe(200)
      expect(mockGetMerchant).toHaveBeenCalledWith(deal.sellerId)
      expect(mockGetMerchant).toHaveBeenCalledWith(deal.buyerId)
      expect(mockGetAdvertising).toHaveBeenCalledWith(deal.sellerId, deal.advertisingId)
      expect(mockSave).toHaveBeenCalledWith({
        sellerId: deal.sellerId,
        buyerId: deal.buyerId,
        advertisingId: deal.advertisingId,
      })
    })

    it('is an invalid deal when the advertising does not exist', async () => {
      const merchant = merchantFactory()
      const advertising = null
      const mockFind = jest.fn().mockResolvedValue([])
      const mockGetMerchant = jest.fn().mockResolvedValue(merchant)
      const mockGetAdvertising = jest.fn().mockResolvedValue(advertising)
      const mockSave = jest.fn()

      jest.spyOn(typeorm, 'getCustomRepository').mockReturnValue({
        findByAdvertisingId: mockFind,
        save: mockSave
      })
      jest.spyOn(AdvertisingServiceClient, 'getMerchant').mockImplementation(mockGetMerchant)
      jest.spyOn(AdvertisingServiceClient, 'getAdvertising').mockImplementation(mockGetAdvertising)

      const deal = dealFactory()
      const response = await request(App).post('/v1/deals').send({
        sellerId: deal.sellerId,
        buyerId: deal.buyerId,
        advertisingId: deal.advertisingId,
      })

      expect(response.statusCode).toBe(400)
      expect(mockGetMerchant).toHaveBeenCalledWith(deal.sellerId)
      expect(mockGetMerchant).toHaveBeenCalledWith(deal.buyerId)
      expect(mockGetAdvertising).toHaveBeenCalledWith(deal.sellerId, deal.advertisingId)
      expect(mockSave).not.toHaveBeenCalled()
      expect(response.body).toMatchObject({
        ok: false,
        error: {
          name: 'ValidationError',
          message: i18n.__('deal.errors.invalid-advertising')
        }
      })
    })

    it('is an invalid deal when the advertising already has a deal', async () => {
      const merchant = merchantFactory()
      const advertising = advertisingFactory()
      const deal = dealFactory({ advertisingId: advertising.id })
      const mockFind = jest.fn().mockResolvedValue([deal])
      const mockGetMerchant = jest.fn().mockResolvedValue(merchant)
      const mockGetAdvertising = jest.fn().mockResolvedValue(advertising)
      const mockSave = jest.fn()

      jest.spyOn(typeorm, 'getCustomRepository').mockReturnValue({
        findByAdvertisingId: mockFind,
        save: mockSave
      })
      jest.spyOn(AdvertisingServiceClient, 'getMerchant').mockImplementation(mockGetMerchant)
      jest.spyOn(AdvertisingServiceClient, 'getAdvertising').mockImplementation(mockGetAdvertising)

      const response = await request(App).post('/v1/deals').send({
        sellerId: deal.sellerId,
        buyerId: deal.buyerId,
        advertisingId: deal.advertisingId,
      })

      expect(response.statusCode).toBe(400)
      expect(mockGetMerchant).toHaveBeenCalledWith(deal.sellerId)
      expect(mockGetMerchant).toHaveBeenCalledWith(deal.buyerId)
      expect(mockGetAdvertising).toHaveBeenCalledWith(deal.sellerId, deal.advertisingId)
      expect(mockSave).not.toHaveBeenCalled()
      expect(response.body).toMatchObject({
        ok: false,
        error: {
          name: 'ValidationError',
          message: i18n.__('deal.errors.already-bought')
        }
      })
    })
  })
})