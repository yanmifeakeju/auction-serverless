import { v4 as uuid } from 'uuid';
import { putItem } from '../libs/dynamoCommand.js';
import createHttpError from 'http-errors';
import commonMiddleWare from '../libs/commonMiddleWare.js';

async function createAuction(event, _context) {
  const { title } = event.body;

  const now = new Date();
  const endDate = new Date();
  endDate.setHours(now.getHours() + 1);

  const auction = {
    id: uuid(),
    title,
    status: 'OPEN',
    createdAt: now.toISOString(),
    endingAt: endDate.toISOString(),
    highestBid: { amount: 0 },
  };

  try {
    await putItem(process.env.AUCTIONS_TABLE_NAME, auction);
  } catch (error) {
    console.log(error);
    throw new createHttpError.InternalServerError(error);
  }

  return {
    statusCode: 201,
    body: JSON.stringify({ auction }),
  };
}

export const handler = commonMiddleWare(createAuction);
