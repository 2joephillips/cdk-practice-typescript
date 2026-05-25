import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb';

const client = DynamoDBDocumentClient.from(new DynamoDBClient({}));

export const handler = async () => {
  const greeting = process.env.GREETING ?? 'Hello from default';
  const tableName = process.env.TABLE_NAME;

  if (!tableName) {
    throw new Error('TABLE_NAME is not configured');
  }

  const id = crypto.randomUUID();

  await client.send(
    new PutCommand({
      TableName: tableName,
      Item: {
        id,
        message: greeting,
        createdAt: new Date().toISOString(),
      },
    }),
  );

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: greeting,
    }),
  };
};
