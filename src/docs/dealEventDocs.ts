import createDoc from '@cig-platform/docs/build/docs/createDoc'

import { storeDealEventSchema } from '@Schemas/DealEventSchemas'

const dealEventDocs = {
  ...createDoc('/deals/{dealId}/events', ['Deal events'], [
    {
      method: 'post',
      title: 'Register deal event',
      objectSchema: storeDealEventSchema,
    },
    {
      method: 'get',
      title: 'Get deal events',
    }
  ], {
    pathVariables: [
      {
        name: 'dealId',
        type: 'string'
      }
    ]
  }),
}

export default dealEventDocs
