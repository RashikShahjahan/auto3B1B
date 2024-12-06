import { Queue } from "bullmq";
import type { SplitterJob } from "./schemas/jobinterfaces";
import express, { type Request as ExpressRequest, type Response as ExpressResponse } from "express";
import type { Request, Response } from "express";
import { jobEvents } from "./utils/events";
import cors from "cors";

const app = express();
const splitterQueue = new Queue<SplitterJob>('script-generation');

app.use(cors());
app.use(express.json());

app.get('/jobs/events', (req: ExpressRequest, res: ExpressResponse) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  res.write('data: {"message":"Connected to event stream"}\n\n');

  const sendEvent = (event: string, data: any) => {
    res.write(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`);
  };

  jobEvents.on('job-completed', (data) => sendEvent('job-completed', data));
  jobEvents.on('job-failed', (data) => sendEvent('job-failed', data));

  req.on('close', () => {
    jobEvents.removeAllListeners('job-completed');
    jobEvents.removeAllListeners('job-failed');
  });
});

app.post('/jobs', async (req: Request, res: Response) => {
  try {
    const { topic } = req.body;
    const job = await splitterQueue.add("split", { topic });
    res.json({ jobId: job.id });
  } catch (error) {
    console.error('Error creating job:', error);
    res.status(500).json({ error: 'Failed to create job' });
  }
});


app.listen(3000, () => {
  console.log("Server is running on port 3000");
});