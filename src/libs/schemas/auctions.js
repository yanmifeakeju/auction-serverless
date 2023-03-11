export const createAuctionSchema = {
  type: 'object',
  required: ['body'],
  properties: {
    body: {
      type: 'object',
      properties: {
        title: {
          type: 'string',
          minLength: 5,
          maxLength: 250,
        },
      },

      required: ['title'],
    },
  },
};

export const getAuctionsSchema = {
  type: 'object',
  required: ['queryStringParameters'],
  properties: {
    queryStringParameters: {
      type: 'object',
      properties: {
        status: {
          type: 'string',
          enum: ['OPEN', 'CLOSED'],
          default: 'OPEN',
        },
      },
    },
  },
};
