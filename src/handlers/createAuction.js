import commonMiddleWare from '../libs/commonMiddleWare.js';
import { saveAuction } from '../auctions/index.js';
import { errorHandler, formatErrorMessage } from '../libs/errors.js';
import { createAuctionSchema } from '../libs/schemas/auctions.js';
import validator from '@middy/validator';
import { transpileSchema } from '@middy/validator/transpile';

async function createAuction(event, _context) {
  const { title } = event.body;

  try {
    const auction = await saveAuction({ title });

    return {
      statusCode: 201,
      body: JSON.stringify({ status: true, data: auction }),
    };
  } catch (error) {
    errorHandler(error);
  }
}

export const handler = commonMiddleWare(createAuction)
  .use(
    validator({
      eventSchema: transpileSchema(createAuctionSchema),
    })
  )
  .use({
    onError: (request) => {
      request.response = {
        statusCode: request.error.statusCode,
        body: JSON.stringify({
          status: false,
          message: formatErrorMessage(request.error.cause[0]),
        }),
      };
    },
  });
