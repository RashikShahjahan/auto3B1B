import { CreateBucketCommand, PutObjectCommand, S3Client, HeadBucketCommand, HeadObjectCommand } from "@aws-sdk/client-s3";
import { readFileSync } from "fs";


export const s3Client = new S3Client({});


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

export const uploadFileToBucket = async ({ bucketName, filepath }: { bucketName: string, filepath: string }) => {

  const fileContent = readFileSync(filepath);    
  
  const key = filepath.split('/').pop() || filepath;
  
  await s3Client.send(
      new PutObjectCommand({
        Bucket: bucketName,
        Body: fileContent,
        Key: key,
      }),
    );
    console.log(`${key} uploaded successfully.`);
  
};
  
  