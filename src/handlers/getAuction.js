import middy from '@middy/core';
import httpJsonBodyParser from '@middy/http-json-body-parser';
import httpEventNormalizer from '@middy/http-event-normalizer';
import httpErrorHandler from '@middy/http-error-handler';
import createHttpError from 'http-errors';
import { getTableItems } from '../libs/dynamoCommand.js';

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

export const handler = middy(getAuction)
  .use(httpJsonBodyParser())
  .use(httpEventNormalizer())
  .use(httpErrorHandler());
