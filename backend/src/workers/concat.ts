import {createVideo} from "../utils/videoGeneration"
import type { ConcatJob } from "../schemas/jobinterfaces";

export default async function concatProcessor (job: ConcatJob) {
  const processedChunks = await job.getChildrenValues();
  console.log("Processed chunks", processedChunks);
  
  const segments = Object.values(processedChunks).map(chunk => ({
    animationFile: chunk.animationFile,
    audioFile: chunk.audioFile
  }));

  const video = await createVideo(segments);
  return video;
}

