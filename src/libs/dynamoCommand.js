import {
  PutCommand,
  ScanCommand,
  GetCommand,
  UpdateCommand,
} from '@aws-sdk/lib-dynamodb';
import { ddbDocClient } from '../infrastructure/databases/dynamoDB/documentClient.js';
import { ddbClient } from '../infrastructure/databases/dynamoDB/client.js';
import { QueryCommand } from '@aws-sdk/client-dynamodb';

export const putItem = async (tableName, items) => {
  const params = {
    TableName: tableName,
    Item: {
      ...items,
    },
    ReturnValues: 'ALL_OLD',
  };
  return ddbDocClient.send(new PutCommand(params));
};

export const scanTableItems = async (tableName) =>
  ddbClient.send(new ScanCommand({ TableName: tableName }));

export const getTableItems = async (tableName, key) =>
  ddbDocClient.send(new GetCommand({ Key: { ...key }, TableName: tableName }));

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

// TODO:: pass params like this in all function
export const queryTableItems = async (params) =>
  ddbDocClient.send(new QueryCommand(params));
