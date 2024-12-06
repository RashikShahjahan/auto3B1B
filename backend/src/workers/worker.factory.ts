import { Worker } from 'bullmq';
import type { ConnectionOptions, Processor } from 'bullmq';
export function createWorker(
    name: string,
    processor: Processor,
    connection: ConnectionOptions,
    concurrency: number
  ) {
    const worker = new Worker(name, processor, {connection, concurrency});
  
    worker.on("completed", (job, err) => {
      console.log(`Completed job on queue ${name}`);
    });
  
    worker.on("failed", (job, err) => {
      console.log(`Faille job on queue ${name}`, err);
    });
  
    return worker;
  }