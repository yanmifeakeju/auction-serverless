import { v4 as uuid } from 'uuid';
import { putItem } from '../libs/dynamoCommand.js';

async function createAuction(event, _context) {
  const { title } = JSON.parse(event.body);
  const now = new Date();

  const auction = {
    id: uuid(),
    title,
    status: 'OPEN',
    createdAt: now.toISOString(),
  };

  const data = await putItem(process.env.AUCTIONS_TABLE_NAME, auction);

  return {
    statusCode: 200,
    body: JSON.stringify({ data }),
  };
}

export const handler = createAuction;
