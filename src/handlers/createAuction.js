import createHttpError from 'http-errors';
import commonMiddleWare from '../libs/commonMiddleWare.js';
import { saveAuction } from '../auctions/index.js';

async function createAuction(event, _context) {
  const { title } = event.body;

  try {
    const auction = await saveAuction({ title });

    return {
      statusCode: 201,
      body: JSON.stringify({ auction }),
    };
  } catch (error) {
    console.log(error);
    throw new createHttpError.InternalServerError(error);
  }
}

export const handler = commonMiddleWare(createAuction);
