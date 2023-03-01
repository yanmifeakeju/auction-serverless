import middy from '@middy/core';
import httpJsonBodyParser from '@middy/http-json-body-parser';
import httpEventNormalizer from '@middy/http-event-normalizer';
import httpErrorHandler from '@middy/http-error-handler';
import createHttpError from 'http-errors';
import { scanTableItems } from '../libs/dynamoCommand.js';

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

export const handler = middy(getAuctions)
  .use(httpJsonBodyParser())
  .use(httpEventNormalizer())
  .use(httpErrorHandler());
