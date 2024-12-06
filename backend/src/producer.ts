import { Queue } from "bullmq";
import type { SplitterJob } from "./schemas/jobinterfaces";
const splitterQueue = new Queue<SplitterJob>('script-generation');

async function addJobs() {
  console.log("Adding jobs...");
  await splitterQueue.add("split", {
    topic: "Simple harmonic motion of a pendulum",
  });
  console.log("Done");
  await splitterQueue.close();
}

addJobs();