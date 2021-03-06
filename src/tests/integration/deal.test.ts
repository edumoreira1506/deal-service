import request from 'supertest'
import typeorm from 'typeorm'
import faker from '@faker-js/faker'
import { dealFactory, merchantFactory, advertisingFactory } from '@cig-platform/factories'
import { DealEventValueEnum } from '@cig-platform/enums'

import App from '@Configs/server'
import AdvertisingServiceClient from '@Clients/AdvertisingServiceClient'
import i18n from '@Configs/i18n'
import { MAX_DEALS_PER_ADVERTISING } from '@Builders/DealBuilder'

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

    it('is an invalid deal when the advertising already has a confirmed deal', async () => {
      const merchant = merchantFactory()
      const advertising = advertisingFactory()
      const deal = {
        ...dealFactory({ advertisingId: advertising.id }),
        events: [
          { value: DealEventValueEnum.confirmed }
        ]
      }
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

    it('is an invalid deal when has more than 30 deals for the same advertising', async () => {
      const merchant = merchantFactory()
      const advertising = advertisingFactory()
      const deal = dealFactory()
      const mockFind = jest.fn().mockResolvedValue(Array(MAX_DEALS_PER_ADVERTISING).fill(deal))
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
          message: i18n.__('deal.errors.full')
        }
      })
    })
  })

  describe('index', () => {
    it('return all deals', async () => {
      const deals = Array(10).fill(dealFactory())
      const mockSearch = jest.fn().mockResolvedValue(deals)
      const sellerId = faker.datatype.uuid()
      const buyerId = faker.datatype.uuid()
      const advertisingId = faker.datatype.uuid()
      const page = 0
      const pages = 1
      const total = 10
      const mockCountDetails = jest.fn().mockResolvedValue({ pages, total })

      jest.spyOn(typeorm, 'getCustomRepository').mockReturnValue({
        search: mockSearch,
        countDetails: mockCountDetails
      })

      const response = await request(App).get(`/v1/deals?sellerId=${sellerId}&buyerId=${buyerId}&advertisingId=${advertisingId}&page=${page}`)

      expect(response.statusCode).toBe(200)
      expect(response.body).toMatchObject({
        ok: true,
        deals: deals.map(deal => ({ ...deal, createdAt: deal.createdAt.toISOString() })),
        message: i18n.__('messages.success'),
        pages,
        total
      })
      expect(mockSearch).toHaveBeenCalledWith({ sellerId, buyerId, advertisingId, page })
      expect(mockCountDetails).toHaveBeenCalledWith({ sellerId, buyerId, advertisingId })
    })
  })

  describe('show', () => {
    it('return the deal', async () => {
      const deal = dealFactory()
      const mockFindById = jest.fn().mockResolvedValue(deal)

      jest.spyOn(typeorm, 'getCustomRepository').mockReturnValue({
        findById: mockFindById,
      })

      const response = await request(App).get(`/v1/deals/${deal.id}`)

      expect(response.statusCode).toBe(200)
      expect(response.body).toMatchObject({
        ok: true,
        deal: {
          ...deal,
          createdAt: deal.createdAt.toISOString()
        }
      })
      expect(mockFindById).toHaveBeenCalledWith(deal.id)
    })

    it('returns a not found error', async () => {
      const deal = null
      const mockFindById = jest.fn().mockResolvedValue(deal)
      const dealId = faker.datatype.uuid()

      jest.spyOn(typeorm, 'getCustomRepository').mockReturnValue({
        findById: mockFindById,
      })

      const response = await request(App).get(`/v1/deals/${dealId}`)

      expect(response.statusCode).toBe(400)
      expect(response.body).toMatchObject({
        ok: false,
        error: {
          name: 'NotFoundError',
          message: i18n.__('errors.not-found')
        }
      })
      expect(mockFindById).toHaveBeenCalledWith(dealId)
    })
  })
})
