import commonMiddleWare from '../libs/commonMiddleWare.js';
import { fetchAuctions } from '../auctions/index.js';
import { errorHandler, errorResponseSanitizer } from '../libs/errors.js';
import { getAuctionsSchema } from '../libs/schemas/auctions.js';
import validator from '@middy/validator';
import { transpileSchema } from '@middy/validator/transpile';

async function getAuctions(event, _) {
  try {
    const { status } = event.queryStringParameters;
    const auctions = await fetchAuctions(status);

    return {
      statusCode: 200,
      body: JSON.stringify({
        status: true,
        data: { count: auctions.length, auctions },
      }),
    };
  } catch (error) {
    errorHandler(error);
  }
}

export const handler = commonMiddleWare(getAuctions)
  .use(
    validator({
      eventSchema: transpileSchema(getAuctionsSchema),
    })
  )
  .use({
    onError: (request) => {
      request.response = errorResponseSanitizer(request.error);
    },
  });
