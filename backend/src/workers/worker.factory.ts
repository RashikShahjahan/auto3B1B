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
  
    worker.on("completed", async (job, returnvalue) => {
      try {
        console.log(`Completed job ${job?.id} on queue ${name}: ${job?.returnvalue ? JSON.stringify(job?.returnvalue) : 'No return value' }`);
        await prisma.job.update({
          where: { id: job?.id },
          data: { status: 'completed', returnvalue: JSON.stringify(returnvalue) }
        });
      } catch (error) {
        console.error(`Error updating completed job ${job?.id}:`, error);
      }
    });
  
    worker.on("failed", async (job, err) => {
      try {
        console.log(`Failed job ${job?.id} on queue ${name}`, err);
        await prisma.job.update({
          where: { id: job?.id },
          data: { status: 'failed', failedReason: err.message }
        });
      } catch (error) {
        console.error(`Error updating failed job ${job?.id}:`, error);
      }
    });
  
    return worker;
  }