import {createVideo} from "../utils/videoGeneration"
import type { ConcatJob } from "../schemas/jobinterfaces";

export default async function concatProcessor (job: ConcatJob) {
  const processedChunks = await job.getChildrenValues();
  
  console.log("Processed chunks", processedChunks);
  
  const segmentMap = new Map();
  
  Object.values(processedChunks).forEach(chunk => {
    const index = chunk?.index;
    console.log("Index", index);
    if (index === undefined) {
      throw new Error(`Missing index in chunk data`);
    }
    
    if (!segmentMap.has(index)) {
      segmentMap.set(index, {});
    }
    
    if (chunk.animationFile) {
      segmentMap.get(index).animationFile = chunk.animationFile;
    }
    if (chunk.narrationFile) {
      segmentMap.get(index).narrationFile = chunk.narrationFile;
    }
  });

  const segments = Array.from(segmentMap.entries())
    .sort(([a], [b]) => a - b)
    .map(([_, segment]) => {
      if (!segment.animationFile || !segment.narrationFile) {
        throw new Error(`Missing animation or narration file for segment`);
      }
      return segment;
    });
  
  const video = await createVideo(segments, job.id??'');
  return video;
}

