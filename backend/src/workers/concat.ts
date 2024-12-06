import {createVideo} from "../utils/videoGeneration"
import type { ConcatJob } from "../schemas/jobinterfaces";

export default async function concatProcessor (job: ConcatJob) {
  const processedChunks = await job.getChildrenValues();
  console.log("Processed chunks", processedChunks);
  const video = await createVideo(Object.values(processedChunks.animation_files), Object.values(processedChunks.audio_files));
  return video;
}

