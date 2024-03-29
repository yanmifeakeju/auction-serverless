import commonMiddleWare from '../libs/commonMiddleWare.js';
import { saveAuction } from '../auctions/index.js';
import { errorHandler, errorResponseSanitizer } from '../libs/errors.js';
import { createAuctionSchema } from '../libs/schemas/auctions.js';
import validator from '@middy/validator';
import { transpileSchema } from '@middy/validator/transpile';

async function createAuction(event, _) {
  const { title } = event.body;
  const { email } = event.requestContext.authorizer;

  try {
    const auction = await saveAuction({ title, email });

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
      request.response = errorResponseSanitizer(request.error);
    },
  });
