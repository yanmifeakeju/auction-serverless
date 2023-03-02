import createHttpError from 'http-errors';
import { scanTableItems } from '../libs/dynamoCommand.js';
import commonMiddleWare from '../libs/commonMiddleWare.js';

async function getAuctions(event, _context) {
  let auctions;

  try {
    const result = await scanTableItems(process.env.AUCTIONS_TABLE_NAME);
    auctions = result.Items || [];
  } catch (error) {
    console.log(error);
    throw new createHttpError.InternalServerError(error);
  }
  return {
    statusCode: 200,
    body: JSON.stringify({ auctions }),
  };
}

export const handler = commonMiddleWare(getAuctions);
