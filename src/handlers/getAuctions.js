import createHttpError from 'http-errors';
import commonMiddleWare from '../libs/commonMiddleWare.js';
import { fetchAuctions } from '../auctions/index.js';
import { errorHandler } from '../libs/utils.js';

async function getAuctions(event, _context) {
  try {
    const { status } = event.queryStringParameters;
    const auctions = await fetchAuctions(status);

    return { statusCode: 200, body: JSON.stringify({ auctions }) };
  } catch (error) {
    errorHandler(error);
  }
}

export const handler = commonMiddleWare(getAuctions);
