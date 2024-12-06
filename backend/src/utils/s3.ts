import { CreateBucketCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { readFileSync } from "fs";


const client = new S3Client({});


export const createBucket = async (bucketName: string) => {
    const command = new CreateBucketCommand({ Bucket: bucketName });
    await client.send(command);
    console.log("Bucket created successfully.\n");
    return bucketName;
  };

  export const createFolder = async (bucketName: string, folderName: string) => {
    const command = new PutObjectCommand({ Bucket: bucketName, Key: folderName });
    await client.send(command);
    console.log(`Folder ${folderName} created successfully.\n`);
  };
  
  export const uploadFileToBucket = async ({ bucketName, filepath }: { bucketName: string, filepath: string }) => {

    const fileContent = readFileSync(filepath);    
  
    const key = filepath.split('/').pop() || filepath;
  
    await client.send(
        new PutObjectCommand({
          Bucket: bucketName,
          Body: fileContent,
          Key: key,
        }),
      );
      console.log(`${key} uploaded successfully.`);
    
  };
  
  