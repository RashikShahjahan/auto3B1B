import type { NarrationJob } from "../schemas/jobinterfaces";
import {convertTextToSpeech} from "../utils/textToSpeech"
import {uploadBufferToBucket} from "../utils/s3";
import { generateNarration } from "../utils/scriptGeneration";

export default async function narrationProcessor (job: NarrationJob) {
  const narration = await generateNarration(job.data.text);
  if (!narration) {
    throw new Error("No narration generated");
  }

  const textBuffer = Buffer.from(narration);
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