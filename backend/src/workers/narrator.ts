import type { NarrationJob } from "../schemas/jobinterfaces";
import {convertTextToSpeech} from "../utils/textToSpeech"
import {uploadBufferToBucket} from "../utils/s3";

export default async function narrationProcessor (job: NarrationJob) {

    
  const textBuffer = Buffer.from(job.data.text);
  await uploadBufferToBucket({
      bucketName: 'auto-3b1b',
      buffer: textBuffer,
      key: `narration-scripts/${job.id}.txt`
    });

  const narrationFile = await convertTextToSpeech(job.data.text, job.id ?? '');
  await uploadBufferToBucket({
    bucketName: 'auto-3b1b',
    buffer: Buffer.from(narrationFile),
    key: `narration-audio/${job.id}.mp3`
  });


  return {
    narrationFile, 
    textFilePath: `${job.id}.txt`,
    id: job.id,
    index: job.data.index 
  };
}