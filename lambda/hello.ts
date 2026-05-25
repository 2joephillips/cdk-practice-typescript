export const handler = async () => {
  const greeting = process.env.GREETING || 'Hello from Lambda!';
  const bucketName = process.env.BUCKET_NAME ?? 'No bucket configured';

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: greeting,
      bucket: bucketName,
    }),
  };
};
