import request from 'supertest'
import typeorm from 'typeorm'
import faker from 'faker'
import { dealFactory } from '@cig-platform/factories'

import App from '@Configs/server'
import { DealEventValueEnum } from '@cig-platform/enums'
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
    Object.values(DealEventValueEnum).forEach(eventValue => {
      it(`is a valid event when value is ${eventValue}`, async () => {
        const deal = dealFactory()
        const mockFindById = jest.fn().mockResolvedValue(deal)
        const mockSave = jest.fn()
        const metadata = {}
  
        jest.spyOn(typeorm, 'getCustomRepository').mockReturnValue({
          findById: mockFindById,
          save: mockSave
        })

        const response = await request(App).post(`/v1/deals/${deal.id}/events`).send({
          value: eventValue,
          metadata
        })
  
        expect(response.statusCode).toBe(200)
        expect(mockFindById).toHaveBeenCalledWith(deal.id)
        expect(mockSave).toHaveBeenCalledWith({
          metadata,
          value: eventValue,
          dealId: deal.id
        })
      })
    })

    it('is an invalid event when deal is finished', async () => {
      const deal = dealFactory({ finished: true })
      const mockFindById = jest.fn().mockResolvedValue(deal)
      const mockSave = jest.fn()
      const metadata = {}

      jest.spyOn(typeorm, 'getCustomRepository').mockReturnValue({
        findById: mockFindById,
        save: mockSave
      })

      const response = await request(App).post(`/v1/deals/${deal.id}/events`).send({
        value: DealEventValueEnum.confirmed,
        metadata
      })

      expect(response.statusCode).toBe(400)
      expect(response.body).toMatchObject({
        ok: false,
        error: {
          name: 'FinishedDealError',
          message: i18n.__('deal-event.errors.finished-deal')
        }
      })
      expect(mockFindById).toHaveBeenCalledWith(deal.id)
      expect(mockSave).not.toHaveBeenCalled()
    })

    it('is an invalid event when deal is cancelled', async () => {
      const deal = dealFactory({ cancelled: true })
      const mockFindById = jest.fn().mockResolvedValue(deal)
      const mockSave = jest.fn()
      const metadata = {}

      jest.spyOn(typeorm, 'getCustomRepository').mockReturnValue({
        findById: mockFindById,
        save: mockSave
      })

      const response = await request(App).post(`/v1/deals/${deal.id}/events`).send({
        value: DealEventValueEnum.confirmed,
        metadata
      })

      expect(response.statusCode).toBe(400)
      expect(response.body).toMatchObject({
        ok: false,
        error: {
          name: 'CancelledDealError',
          message: i18n.__('deal-event.errors.cancelled-deal')
        }
      })
      expect(mockFindById).toHaveBeenCalledWith(deal.id)
      expect(mockSave).not.toHaveBeenCalled()
    })

    it('is an invalid event when deal does not exist', async () => {
      const deal = null
      const mockFindById = jest.fn().mockResolvedValue(deal)
      const mockSave = jest.fn()
      const metadata = {}
      const dealId = faker.datatype.uuid()

      jest.spyOn(typeorm, 'getCustomRepository').mockReturnValue({
        findById: mockFindById,
        save: mockSave
      })

      const response = await request(App).post(`/v1/deals/${dealId}/events`).send({
        value: DealEventValueEnum.confirmed,
        metadata
      })

      expect(response.statusCode).toBe(400)
      expect(response.body).toMatchObject({
        ok: false,
        error: {
          name: 'NotFoundError',
          message: i18n.__('errors.not-found')
        }
      })
      expect(mockFindById).toHaveBeenCalledWith(dealId)
      expect(mockSave).not.toHaveBeenCalled()
    })
  })
})
