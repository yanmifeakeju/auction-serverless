import { updateAuctionBid } from '../auctions/index.js';
import commonMiddleWare from '../libs/commonMiddleWare.js';
import { errorHandler } from '../libs/utils.js';

async function placeBid(event, _context) {
  const { id } = event.pathParameters;
  const { amount } = event.body;

  try {
    const updatedAuctionBid = await updateAuctionBid(id, amount);

    return {
      statusCode: 200,
      body: JSON.stringify({ auction: updatedAuctionBid }),
    };
  } catch (error) {
    errorHandler(error);
  }
}

export const handler = commonMiddleWare(placeBid);
