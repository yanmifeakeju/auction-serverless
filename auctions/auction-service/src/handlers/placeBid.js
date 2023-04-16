import { updateAuctionBid } from '../auctions/index.js';
import commonMiddleWare from '../libs/commonMiddleWare.js';
import { errorHandler, errorResponseSanitizer } from '../libs/errors.js';
import { placeAuctionBidSchema } from '../libs/schemas/auctions.js';
import validator from '@middy/validator';
import { transpileSchema } from '@middy/validator/transpile';

async function placeBid(event, _) {
  const { id } = event.pathParameters;
  const { amount } = event.body;
  const { email } = event.requestContext.authorizer;

  try {
    const updatedAuctionBid = await updateAuctionBid(id, {
      amount,
      bidder: email,
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ auction: updatedAuctionBid }),
    };
  } catch (error) {
    errorHandler(error);
  }
}

export const handler = commonMiddleWare(placeBid)
  .use(
    validator({
      eventSchema: transpileSchema(placeAuctionBidSchema),
    })
  )
  .use({
    onError: (request) => {
      if (!request.response)
        request.response = errorResponseSanitizer(request.error);
    },
  });
