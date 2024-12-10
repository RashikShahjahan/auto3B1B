import {generateVideoScript} from "../utils/scriptGeneration"
import {FlowProducer} from "bullmq"
import type { ScriptSegmentPair } from "../schemas/schema";
import { prisma } from '../utils/db';

export default async function startJob(topic: string) {
    const script = await generateVideoScript(topic);
    if (!script) {
        throw new Error("No script generated");
    }
    const chunks = await splitToChunks(script);
    const flow = await addChunksToQueue(chunks, topic);

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
  
async function addChunksToQueue(chunks: {animation_segments: string[], narration_segments: string[]}, topic: string) {
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

    // Create the parent job
    await prisma.job.create({
        data: {
            id: flow.job.id,
            status: 'waiting',
            data: { topic },
            type: 'create-video',
        },
    });

    // Create jobs for each animation and narration task
    const childJobs = flow.children?.map(async (child) => {
        await prisma.job.create({
            data: {
                id: child.job.id,
                status: 'waiting',
                parentId: flow.job.id,
                type: child.job.name,
                data: child.job.data,
            },
        });
    });

    if (childJobs) {
        await Promise.all(childJobs);
    }

    return flow;
}







 

