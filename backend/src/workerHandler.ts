import animationProcessor from "./workers/animator";
import concatProcessor from "./workers/concat";
import narrationProcessor from "./workers/narrator";
import splitterProcessor from "./workers/splitter";
import {createWorker} from "./workers/worker.factory";
import { createBucket, createFolder} from "./utils/s3";

const connection = {
  host: "localhost",
  port: 6379,
};

const BUCKET_NAME = 'auto-3b1b';

const folders = [
  'narration-scripts',
  'animation-code',
  'animation-videos',
  'narration-audio',
  'output-videos'
];

const initializeStorage = async () => {
  try {
    await createBucket(BUCKET_NAME);
    for (const folder of folders) {
      await createFolder(BUCKET_NAME, folder);
    }
    console.log('Bucket and folders created successfully');
  } catch (error) {
    console.error('Error creating bucket or folders:', error);
    throw error; // Re-throw to handle in main flow
  }
};

async function main() {
  try {
    await initializeStorage();
    
    const splitterWorker = createWorker('script-generation', splitterProcessor, connection, 8);
    const animationWorker = createWorker('animation-creation', animationProcessor, connection, 2);
    const narrationWorker = createWorker('narration-creation', narrationProcessor, connection, 8);
    const concatWorker = createWorker('video-creation', concatProcessor, connection, 4);

    process.on("SIGTERM", async () => {
      console.info("SIGTERM signal received: closing queues");
      await splitterWorker.close();
      await animationWorker.close();
      await narrationWorker.close();
      await concatWorker.close();
      console.info("All closed");
    });
  } catch (error) {
    console.error('Failed to initialize application:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  main().catch((error) => {
    console.error('Unhandled error:', error);
    process.exit(1);
  });
}

