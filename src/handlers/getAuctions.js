import createHttpError from 'http-errors';
import commonMiddleWare from '../libs/commonMiddleWare.js';
import { fetchAuctions } from '../auctions/index.js';

async function getAuctions(_event, _context) {
  try {
    const auctions = await fetchAuctions();

    return { statusCode: 200, body: JSON.stringify({ auctions }) };
  } catch (error) {
    console.log(error);
    throw new createHttpError.InternalServerError(error);
  }
}

export const handler = commonMiddleWare(getAuctions);
