import { Worker } from 'bullmq';
import type { ConnectionOptions, Processor } from 'bullmq';
import { prisma } from '../utils/db';

export function createWorker(
    name: string,
    processor: Processor,
    connection: ConnectionOptions,
    concurrency: number
  ) {
    const worker = new Worker(name, processor, {connection, concurrency});
  
    worker.on("completed", (job, returnvalue) => {
      console.log(`Completed job ${job?.id} on queue ${name}: ${job?.returnvalue ? JSON.stringify(job?.returnvalue) : 'No return value' }`);
      prisma.job.update({
        where: { id: job?.id },
        data: { status: 'completed', returnvalue: JSON.stringify(returnvalue) }
      });
    });
  
    worker.on("failed", (job, err) => {
      console.log(`Failed job ${job?.id} on queue ${name}`, err);
      prisma.job.update({
        where: { id: job?.id },
        data: { status: 'failed', failedReason: err.message }
      });
    });
  
    return worker;
  }