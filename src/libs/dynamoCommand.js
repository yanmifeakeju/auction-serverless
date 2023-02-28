import { PutCommand } from '@aws-sdk/lib-dynamodb';
import { ddbDocClient } from '../infrastructure/databases/dynamoDB/documentClient.js';

export const putItem = async (tableName, items) => {
  const params = {
    TableName: tableName,
    Item: {
      ...items,
    },
  };
  return ddbDocClient.send(new PutCommand(params));
};
