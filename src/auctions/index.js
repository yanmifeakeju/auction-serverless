import { v4 as uuid } from 'uuid';
import {
  getTableItems,
  putItem,
  queryTableItems,
  scanTableItems,
  updateTableItems,
} from '../libs/dynamoCommand.js';

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

  await putItem(process.env.AUCTIONS_TABLE_NAME, auction);
  return { id: auction.id };
};

export const fetchAuctions = async () => {
  const auctionItems = await scanTableItems(process.env.AUCTIONS_TABLE_NAME);

  return auctionItems.Items;
};

export const fetchAuctionById = async (id) => {
  const auction = await getTableItems(process.env.AUCTIONS_TABLE_NAME, { id });
  return auction?.Item;
};

export const updateAuctionBid = async (id, amount) => {
  const auction = await getTableItems(process.env.AUCTIONS_TABLE_NAME, { id });
  if (!auction.Item) throw new Error(`Auction with ${id} does not exist.`);

  const { highestBid } = auction.Item;

  if (highestBid.amount >= amount)
    throw new Error(
      `Your bid of ${amount} is not greater than current ${highestBid.amount}`
    );

  const updatedAuction = await updateTableItems(
    process.env.AUCTIONS_TABLE_NAME,
    { id },
    'set highestBid.amount = :amount',
    {
      ':amount': amount,
    }
  );

  return updatedAuction.Attributes;
};

export const fetchEndedAuctions = async () => {
  const now = new Date();

  const params = {
    TableName: process.env.AUCTIONS_TABLE_NAME,
    IndexName: 'statusAndEndDate',
    KeyConditionExpression: '#status = :status AND endingAt <= :now',
    ExpressionAttributeValues: {
      ':status': { S: 'OPEN' },
      ':now': { S: now.toISOString() },
    },
    ExpressionAttributeNames: { '#status': 'status' },
  };

  const result = await queryTableItems(params);
  return result.Items;
};
