import type { NarrationJob } from "../schemas/jobinterfaces";
import {convertTextToSpeech} from "../utils/textToSpeech"
import path from "path";
import fs from "fs";
import {uploadFileToBucket } from "../utils/s3";

export default async function narrationProcessor (job: NarrationJob) {
  //save narration text to temp folder
  const tempDir = path.join(process.cwd(), 'temp');
  const textFilePath = path.join(tempDir, `${job.id}.txt`);

  await fs.promises.mkdir(tempDir, { recursive: true });
  await fs.promises.writeFile(textFilePath, job.data.text);
  const narrationFile = await convertTextToSpeech(job.data.text, job.id ?? '');


  return {
    narrationFile, 
    textFilePath,
    id: job.id,
    index: job.data.index 
  };
}