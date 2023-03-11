import { closeAuction, fetchEndedAuctions } from '../auctions/index.js';
import { errorHandler } from '../libs/errors.js';

async function processAuctions() {
  try {
    const auctionsToClose = await fetchEndedAuctions();
    const closedPromises = auctionsToClose.map((auction) =>
      closeAuction(auction.id.S)
    );

    await Promise.all(closedPromises);
    return { closed: closedPromises.length };
  } catch (error) {
    errorHandler(error);
  }
}

export const handler = processAuctions;
