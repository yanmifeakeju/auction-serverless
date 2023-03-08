import { fetchEndedAuctions } from '../auctions/index.js';
import { errorHandler } from '../libs/utils.js';

async function processAuctions() {
  try {
    const auctionsToClose = await fetchEndedAuctions();
    console.log(auctionsToClose);
  } catch (error) {
    errorHandler(error);
  }
}

export const handler = processAuctions;
