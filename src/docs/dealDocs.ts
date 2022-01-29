import createDoc from '@cig-platform/docs/build/docs/createDoc'

import { storeDealSchema } from '@Schemas/DealSchemas'

const dealDocs = {
  ...createDoc('/deals', ['Deals'], [
    {
      method: 'post',
      title: 'Register deal',
      objectSchema: storeDealSchema,
    },
  ]),
}

export default dealDocs
