import { CreateBucketCommand, PutObjectCommand, S3Client, HeadBucketCommand, HeadObjectCommand } from "@aws-sdk/client-s3";


if (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY) {
  throw new Error('AWS credentials are required');
}

export const s3Client = new S3Client({
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  }
});


export const bucketExists = async (bucketName: string) => {
  try {
    await s3Client.send(new HeadBucketCommand({ Bucket: bucketName }));
    return true;
  } catch (error) {
    return false;
  }
};

export const folderExists = async (bucketName: string, folderName: string) => {
  try {
    await s3Client.send(new HeadObjectCommand({ 
      Bucket: bucketName, 
      Key: folderName 
    }));
    return true;
  } catch (error) {
    return false;
  }
};

export const createBucket = async (bucketName: string) => {
  if (await bucketExists(bucketName)) {
    console.log("Bucket already exists.\n");
    return bucketName;
  }
  const command = new CreateBucketCommand({ Bucket: bucketName });
  await s3Client.send(command);
  console.log("Bucket created successfully.\n");
  return bucketName;
};

export const createFolder = async (bucketName: string, folderName: string) => {
  if (await folderExists(bucketName, folderName)) {
    console.log(`Folder ${folderName} already exists.\n`);
    return;
  }
  const command = new PutObjectCommand({ Bucket: bucketName, Key: folderName });
  await s3Client.send(command);
  console.log(`Folder ${folderName} created successfully.\n`);
};

export const uploadBufferToBucket = async ({ 
  bucketName, 
  buffer, 
  key 
}: { 
  bucketName: string, 
  buffer: Buffer, 
  key: string 
}) => {
  await s3Client.send(
    new PutObjectCommand({
      Bucket: bucketName,
      Body: buffer,
      Key: key,
    }),
  );
  console.log(`${key} uploaded successfully.`);
};
  
  