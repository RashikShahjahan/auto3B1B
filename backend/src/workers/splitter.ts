import {generateVideoScript} from "../utils/scriptGeneration"
import {FlowProducer} from "bullmq"
import type { SplitterJob} from "../schemas/jobinterfaces";

export default async function splitterProcessor (job: SplitterJob) {
  const script = await generateVideoScript(job.data.topic);
  if (!script) {
        throw new Error("No script generated");
    }
    console.log("Script generated");
    const chunks = await splitToChunks(script);
    await addChunksToQueue(chunks);
  }
  
async function splitToChunks(script: string) {
    const segments = JSON.parse(script).segments;
    const animation_segments = segments.filter((segment: any) => segment.type === "animation");
    const narration_segments = segments.filter((segment: any) => segment.type === "text");
    return { animation_segments, narration_segments};
  }
  
async function addChunksToQueue(chunks: {animation_segments: string[], narration_segments: string[]}) {
    const flowProducer = new FlowProducer();
    return flowProducer.add({
        name: "create-video",
        queueName: "video-creation",
        children: [
            ...chunks.animation_segments.map(animation_segment => ({
                name: "create-animation",
                queueName: "animation-creation",
                data: { prompt: animation_segment },
            })),
            ...chunks.narration_segments.map(narration_segment => ({
                name: "create-narration",
                queueName: "narration-creation",
                data: { text: narration_segment },
                }))
            ],
        }
    );
}







 
