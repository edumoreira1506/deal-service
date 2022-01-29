import Joi from 'joi'
import { DealEventValueEnum } from '@cig-platform/enums'
import i18n from '@Configs/i18n'

export const storeDealEventSchema = Joi.object({
  value: Joi.string().required().valid(...Object.values(DealEventValueEnum)).messages({
    'string.empty': i18n.__('empty-field', { field: 'value' }),
    'any.required': i18n.__('required-field', { field: 'value' }),
    'any.only': i18n.__('deal-event.errors.invalid-value')
  }),
  metadata: Joi.object()
})
