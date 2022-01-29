import { ApiError } from '@cig-platform/core'

import i18n from '@Configs/i18n'

export default class CancelledDealError extends ApiError {
  constructor() {
    super(i18n.__('deal-event.errors.cancelled-deal'))

    this.name = 'CancelledDealError'
  }
}
