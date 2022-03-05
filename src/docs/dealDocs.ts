import createDoc from '@cig-platform/docs/build/docs/createDoc'

import { storeDealSchema, updateDealSchema } from '@Schemas/DealSchemas'

const dealDocs = {
  ...createDoc('/deals', ['Deals'], [
    {
      method: 'post',
      title: 'Register deal',
      objectSchema: storeDealSchema,
    },
    {
      method: 'get',
      title: 'Get deals',
      queryParams: [
        {
          name: 'buyerId',
          type: 'string'
        },
        {
          name: 'sellerId',
          type: 'string'
        },
        {
          name: 'advertisingId',
          type: 'string'
        },
        {
          name: 'page',
          type: 'string'
        }
      ]
    },
  ]),
  ...createDoc('/deals/{dealId}', ['Deals'], [
    {
      method: 'patch',
      title: 'Update deal',
      objectSchema: updateDealSchema,
    },
    {
      method: 'get',
      title: 'Get deal'
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

export default dealDocs
