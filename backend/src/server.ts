import { Queue } from "bullmq";
import type { SplitterJob } from "./schemas/jobinterfaces";
import express from "express";

const app = express();
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

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});