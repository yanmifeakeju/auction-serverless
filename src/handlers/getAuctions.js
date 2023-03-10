import commonMiddleWare from '../libs/commonMiddleWare.js';
import { fetchAuctions } from '../auctions/index.js';
import { errorHandler } from '../libs/utils.js';
import { getAuctionsSchema } from '../libs/schemas/auctions.js';
import validator from '@middy/validator';
import { transpileSchema } from '@middy/validator/transpile';

async function getAuctions(event, _context) {
  try {
    const { status } = event.queryStringParameters;
    const auctions = await fetchAuctions(status);

    return { statusCode: 200, body: JSON.stringify({ auctions }) };
  } catch (error) {
    errorHandler(error);
  }
}

export const handler = commonMiddleWare(getAuctions).use(
  validator({
    eventSchema: transpileSchema(getAuctionsSchema),
  })
);
