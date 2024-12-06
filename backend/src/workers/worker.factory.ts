import { Worker } from 'bullmq';
import type { ConnectionOptions, Processor } from 'bullmq';
import { jobEvents } from '../events';


export function createWorker(
    name: string,
    processor: Processor,
    connection: ConnectionOptions,
    concurrency: number
  ) {
    const worker = new Worker(name, processor, {connection, concurrency});
  
    worker.on("completed", (job, returnvalue) => {
      console.log(`Completed job ${job?.id} on queue ${name}: ${job?.returnvalue ? JSON.stringify(job?.returnvalue) : 'No return value' }`);
      jobEvents.emit('job-completed', {
        jobId: job?.id,
        queue: name,
        returnvalue
      });
    });
  
    worker.on("failed", (job, err) => {
      console.log(`Failed job ${job?.id} on queue ${name}`, err);
      jobEvents.emit('job-failed', {
        jobId: job?.id,
        queue: name,
        error: err.message
      });
    });
  
    return worker;
  }