import { v4 as uuid } from 'uuid';
import { putItem, scanTableItems } from '../libs/dynamoCommand.js';

export const saveAuction = async ({ title }) => {
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

  const savedAuction = await putItem(process.env.AUCTIONS_TABLE_NAME, auction);
  return savedAuction.Attributes;
};

export const fetchAuctions = async () => {
  const auctionItems = await scanTableItems(process.env.AUCTIONS_TABLE_NAME);

  return auctionItems.Items;
};

export const fetchAuctionById = () => {};

export const updateAuction = () => {};

export const fetchAuctionsBids = () => {};
