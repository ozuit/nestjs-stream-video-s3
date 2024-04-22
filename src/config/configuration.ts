export const configuration = () => ({
  s3: {
    endpoint: String(process.env.S3_ENDPOINT),
    region: String(process.env.S3_REGION),
    accessKey: String(process.env.S3_ACCESS_KEY),
    secretKey: String(process.env.S3_SECRET_KEY),
    bucketName: String(process.env.S3_BUCKET_NAME),
    path: process.env.S3_PATH || '',
  },
});

export type TConfig = ReturnType<typeof configuration>;
