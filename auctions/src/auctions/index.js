import { v4 as uuid } from 'uuid';
import {
  getTableItems,
  putItem,
  queryTableItems,
  updateTableItems,
} from '../libs/dynamoCommand.js';
import { AppError } from '../libs/AppError.js';
import { unmarshall } from '@aws-sdk/util-dynamodb';

export const saveAuction = async ({ title, email }) => {
  const now = new Date();
  const endDate = new Date();
  endDate.setHours(now.getHours() + 1);

  const auction = {
    id: uuid(),
    title,
    status: 'OPEN',
    createdAt: now.toISOString(),
    endingAt: endDate.toISOString(),
    highestBid: { amount: 0, bidder: null },
    seller: email,
  };

  await putItem(process.env.AUCTIONS_TABLE_NAME, auction);
  return { id: auction.id };
};

export const fetchAuctions = async (status) => {
  const params = {
    TableName: process.env.AUCTIONS_TABLE_NAME,
    IndexName: 'statusAndEndDate',
    KeyConditionExpression: '#status = :status',
    ExpressionAttributeValues: { ':status': { S: status } },
    ExpressionAttributeNames: { '#status': 'status' },
  };

  const auctionItems = await queryTableItems(params);
  return auctionItems.Items.map((item) => unmarshall(item));
};

export const fetchAuctionById = async (id) => {
  const auction = await getTableItems(process.env.AUCTIONS_TABLE_NAME, { id });
  return auction?.Item;
};

export const updateAuctionBid = async (id, { amount, bidder }) => {
  const auction = await getTableItems(process.env.AUCTIONS_TABLE_NAME, { id });
  if (!auction.Item || auction.Item.status === 'CLOSED')
    throw new AppError(
      `Auction with ${id} is either closed or does not exist.`
    );

  if (!auction.Item.seller || auction.Item.seller === bidder)
    throw new AppError(`Auction bid for ${id} rejected.`);

  const { highestBid } = auction.Item;

  if (highestBid.amount >= amount)
    throw new AppError(
      `Your bid of ${amount} is not greater than current ${highestBid.amount}`
    );

  const params = {
    TableName: process.env.AUCTIONS_TABLE_NAME,
    Key: { id },
    UpdateExpression:
      'set highestBid.amount = :amount, highestBid.bidder = :bidder',
    ExpressionAttributeValues: { ':amount': amount, ':bidder': bidder },
    ReturnValues: 'ALL_NEW',
  };

  const updatedAuction = await updateTableItems(params);
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

export const closeAuction = async (auctionId) => {
  const params = {
    TableName: process.env.AUCTIONS_TABLE_NAME,
    Key: { id: auctionId },
    UpdateExpression: 'set #status = :status',
    ExpressionAttributeValues: { ':status': 'CLOSED' },
    ExpressionAttributeNames: { '#status': 'status' },
  };

  const result = await updateTableItems(params);
  return result.Attributes;
};
