import type { NarrationJob } from "../schemas/jobinterfaces";
import {convertTextToSpeech} from "../utils/textToSpeech"

export default async function narrationProcessor (job: NarrationJob) {
  const narrationFile = await convertTextToSpeech(job.data.text, job.id ?? '');
  return {
    narrationFile, 
    id: job.id,
    data: { index: job.data.index }
  };
}