import createHttpError from 'http-errors';
import { getTableItems } from '../libs/dynamoCommand.js';
import commonMiddleWare from '../libs/commonMiddleWare.js';

async function getAuction(event, _context) {
  const { id } = event.pathParameters;

  let auction;

  try {
    const result = await getTableItems(process.env.AUCTIONS_TABLE_NAME, { id });
    auction = result.Item;
  } catch (error) {
    console.log(error);
    throw new createHttpError.InternalServerError(error);
  }

  if (!auction)
    throw new createHttpError.NotFound(`Auction with id ${id} not found.`);

  return {
    statusCode: 200,
    body: JSON.stringify({ auction }),
  };
}

export const handler = commonMiddleWare(getAuction);
