import { updateTableItems } from '../libs/dynamoCommand.js';
import commonMiddleWare from '../libs/commonMiddleWare.js';
import createError from 'http-errors';
import { getAuctionById } from './getAuction.js';

async function placeBid(event, _context) {
  const { id } = event.pathParameters;
  const { amount } = event.body;

  const auction = await getAuctionById(id);
  if (!auction) throw new createError.NotFound(`Auction with ${id} not found.`);
  if (auction.highestBid.amount >= amount)
    throw new createError.NotAcceptable(
      `The bided amount ${amount} is not greater than the current ${auction.highestBid.amount}`
    );

  let updatedAuction;

  try {
    const result = await updateTableItems(
      process.env.AUCTIONS_TABLE_NAME,
      { id },
      'set highestBid.amount = :amount',
      {
        ':amount': amount,
      }
    );
    updatedAuction = result.Attributes;
  } catch (error) {
    throw new createError.InternalServerError(error);
  }

  return {
    statusCode: 200,
    body: JSON.stringify({ auction: updatedAuction }),
  };
}

export const handler = commonMiddleWare(placeBid);
