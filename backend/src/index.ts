import animationProcessor from "./workers/animator";
import concatProcessor from "./workers/concat";
import narrationProcessor from "./workers/narrator";
import splitterProcessor from "./workers/splitter";
import {createWorker} from "./workers/worker.factory";


const connection = {
  host: "localhost",
  port: 6379,
};

const splitterWorker = createWorker('script-generation', splitterProcessor, connection);
const animationWorker = createWorker('animation-creation', animationProcessor, connection);
const narrationWorker = createWorker('narration-creation', narrationProcessor, connection);
const concatWorker = createWorker('video-creation', concatProcessor, connection);



process.on("SIGTERM", async () => {
  console.info("SIGTERM signal received: closing queues");
  await splitterWorker.close();
  await animationWorker.close();
  await narrationWorker.close();
  await concatWorker.close();
  console.info("All closed");
});

