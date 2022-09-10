import createDoc from '@cig-platform/docs/build/docs/createDoc'

import { storeDealEventSchema } from '@Schemas/DealEventSchemas'

const dealEventDocs = {
  ...createDoc('/deals/{dealId}/events', ['Deal events'], [
    {
      method: 'post',
      title: 'Register deal event',
      objectSchema: storeDealEventSchema,
      headerParams: [{ type: 'string', name: 'Cig-Api-Key' }]
    },
    {
      method: 'get',
      title: 'Get deal events',
      headerParams: [{ type: 'string', name: 'Cig-Api-Key' }]
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
