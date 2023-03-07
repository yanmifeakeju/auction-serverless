import {
  PutCommand,
  ScanCommand,
  GetCommand,
  UpdateCommand,
} from '@aws-sdk/lib-dynamodb';
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

export const getTableItems = async (tableName, key) => {
  return ddbDocClient.send(
    new GetCommand({ Key: { ...key }, TableName: tableName })
  );
};

export const updateTableItems = async (tableName, key, update, attributes) => {
  const params = {
    TableName: tableName,
    Key: key,
    UpdateExpression: update,
    ExpressionAttributeValues: attributes,
    ReturnValues: 'ALL_NEW',
  };

  return ddbDocClient.send(new UpdateCommand(params));
};
