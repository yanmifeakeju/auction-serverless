import createError from 'http-errors';
import commonMiddleWare from '../libs/commonMiddleWare.js';
import { fetchAuctionById } from '../auctions/index.js';
import { errorHandler } from '../libs/errors.js';

async function getAuction(event, _context) {
  const { id } = event.pathParameters;

  try {
    const auction = await fetchAuctionById(id);

    if (!auction)
      throw new createError.NotFound(`Auction with id ${id} not found.`);

    return {
      statusCode: 200,
      body: JSON.stringify({ status: true, data: auction }),
    };
  } catch (error) {
    errorHandler(error);
  }
}

export const handler = commonMiddleWare(getAuction);
