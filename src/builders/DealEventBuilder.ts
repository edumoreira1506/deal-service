import DealEvent from '@Entities/DealEventEntity'

export default class DealBuilder {
  private _value = ''
  private _metadata: Record<string, any> = {}
  private _dealId = ''

  setMetadata(metadata: Record<string, any>): DealBuilder {
    this._metadata = metadata

    return this
  }

  setValue(value: string): DealBuilder {
    this._value = value

    return this
  }

  setDealId(dealId: string): DealBuilder {
    this._dealId = dealId

    return this
  }

  build = (): DealEvent => {
    const dealEvent = new DealEvent()

    dealEvent.value = this._value
    dealEvent.dealId = this._dealId
    dealEvent.metadata = this._metadata

    return dealEvent
  }
}
