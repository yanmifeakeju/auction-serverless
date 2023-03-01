import { PutCommand, ScanCommand } from '@aws-sdk/lib-dynamodb';
import { ddbDocClient } from '../infrastructure/databases/dynamoDB/documentClient.js';
import { ddbClient } from '../infrastructure/databases/dynamoDB/client.js';

export const putItem = async (tableName, items) => {
  const params = {
    TableName: tableName,
    Item: {
      ...items,
    },
  };
  return ddbDocClient.send(new PutCommand(params));
};

export const scanTableItems = async (tableName) => {
  return ddbClient.send(new ScanCommand({ TableName: tableName }));
};
