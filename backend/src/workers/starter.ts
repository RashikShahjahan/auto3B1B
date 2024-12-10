import {generateVideoScript} from "../utils/scriptGeneration"
import {FlowProducer} from "bullmq"
import type { ScriptSegmentPair } from "../schemas/schema";

export default async function startJob(topic: string) {
  const script = await generateVideoScript(topic);
  if (!script) {
        throw new Error("No script generated");
    }
    console.log("Script generated");
    const chunks = await splitToChunks(script);
    console.log(chunks);
    const flow = await addChunksToQueue(chunks);

    return {
        jobId: flow.job.id,
    }
    
  }
  
async function splitToChunks(script: string) {
    const { segments } = JSON.parse(script);
    const animation_segments = segments.map((segment: ScriptSegmentPair) => segment.animation);
    const narration_segments = segments.map((segment: ScriptSegmentPair) => segment.narration);
    return { animation_segments, narration_segments };
}
  
async function addChunksToQueue(chunks: {animation_segments: string[], narration_segments: string[]}) {
    const flowProducer = new FlowProducer();
    const flow = await flowProducer.add({
        name: "create-video",
        queueName: "video-creation",
        children: [
            ...chunks.animation_segments.map((animation_segment, index) => ({
                name: "create-animation",
                queueName: "animation-creation",
                data: { 
                    prompt: animation_segment,
                    index  // Add index to identify the pair
                },
                opts: { ignoreDependencyOnFailure: true },
            })),
            ...chunks.narration_segments.map((narration_segment, index) => ({
                name: "create-narration",
                queueName: "narration-creation",
                data: { 
                    text: narration_segment,
                    index  // Add index to identify the pair
                },
                opts: { ignoreDependencyOnFailure: true },
            }))
        ],
    });

    return flow; 
}







 

