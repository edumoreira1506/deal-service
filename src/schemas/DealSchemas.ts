import Joi from 'joi'

import i18n from '@Configs/i18n'

export const storeDealSchema = Joi.object({
  advertisingId: Joi.string().required().messages({
    'string.empty': i18n.__('empty-field', { field: 'advertisingId' }),
    'any.required': i18n.__('required-field', { field: 'advertisingId' })
  }),
  sellerId: Joi.string().required().messages({
    'string.empty': i18n.__('empty-field', { field: 'sellerId' }),
    'any.required': i18n.__('required-field', { field: 'sellerId' })
  }),
  buyerId: Joi.string().required().messages({
    'string.empty': i18n.__('empty-field', { field: 'buyerId' }),
    'any.required': i18n.__('required-field', { field: 'buyerId' })
  }),
}).options({ abortEarly: false })

export const updateDealSchema = Joi.object({
  finished: Joi.bool(),
  cancelled: Joi.bool()
}).options({ abortEarly: false })
