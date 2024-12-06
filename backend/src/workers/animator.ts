import type { AnimationJob } from "../schemas/jobinterfaces";
import {generateCode} from "../utils/codeGeneration";
import {executeAnimationCode} from "../utils/codeExecution";

export default async function animationProcessor (job: AnimationJob) {
    const codeFilepath = await generateCode(job.data.prompt, job.id ?? '');
    const animationFile = await executeAnimationCode(codeFilepath, job.id ?? '');
    return {
        animationFile, 
        id: job.id,
        index: job.data.index
    };
}

