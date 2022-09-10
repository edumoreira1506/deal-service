import createDoc from '@cig-platform/docs/build/docs/createDoc'

import { storeDealSchema, updateDealSchema } from '@Schemas/DealSchemas'

const dealDocs = {
  ...createDoc('/deals', ['Deals'], [
    {
      method: 'post',
      title: 'Register deal',
      objectSchema: storeDealSchema,
      headerParams: [{ type: 'string', name: 'Cig-Api-Key' }]
    },
    {
      method: 'get',
      title: 'Get deals',
      headerParams: [{ type: 'string', name: 'Cig-Api-Key' }],
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
      headerParams: [{ type: 'string', name: 'Cig-Api-Key' }],
      objectSchema: updateDealSchema,
    },
    {
      method: 'get',
      title: 'Get deal',
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

export default dealDocs
