import type { NarrationJob } from "../schemas/jobinterfaces";
import {convertTextToSpeech} from "../utils/textToSpeech"

export default async function narrationProcessor (job: NarrationJob) {
  const speechFile = await convertTextToSpeech(job.data.text, job.id ?? '');
  return {speechFile, id: job.id};
}