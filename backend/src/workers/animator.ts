import type { AnimationJob } from "../schemas/jobinterfaces";
import {generateCode} from "../utils/codeGeneration";
import {executeAnimationCode} from "../utils/codeExecution";
import { uploadBufferToBucket } from "../utils/s3";

export default async function animationProcessor (job: AnimationJob) {
    const code = await generateCode(job.data.prompt, job.id ?? '');
    await uploadBufferToBucket({
      bucketName: 'auto-3b1b',
      buffer: Buffer.from(code),
      key: `animation-code/${job.id}.py`
    });
    const animationFile = await executeAnimationCode(code, job.id ?? '');
    await uploadBufferToBucket({
      bucketName: 'auto-3b1b',
      buffer: Buffer.from(animationFile),
      key: `animation-videos/${job.id}.mp4`
    });
    return {
        animationFile, 
        id: job.id,
        index: job.data.index
    };
}

