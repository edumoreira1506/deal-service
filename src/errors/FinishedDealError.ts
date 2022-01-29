import { ApiError } from '@cig-platform/core'

import i18n from '@Configs/i18n'

export default class FinishedDealError extends ApiError {
  constructor() {
    super(i18n.__('deal-event.errors.finished-deal'))

    this.name = 'FinishedDealError'
  }
}
