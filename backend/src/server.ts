import { Queue } from "bullmq";
import type { SplitterJob } from "./schemas/jobinterfaces";
import express from "express";
import type { Request, Response } from "express";
import cors from "cors";

const app = express();
const splitterQueue = new Queue<SplitterJob>('script-generation');

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type']
}));

app.options('*', cors());

app.use(express.json());

app.get('/jobs', async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;
    
    const jobs = await splitterQueue.getJobs(['completed', 'failed', 'active', 'waiting']);
    const totalJobs = jobs.length;
    const paginatedJobs = jobs.slice(skip, skip + limit);
    
    const jobsData = await Promise.all(paginatedJobs.map(async job => ({
      id: job.id,
      status: await job.getState(),
      data: job.data,
      returnvalue: job.returnvalue,
      failedReason: job.failedReason,
    })));
    
    const response = {
      jobs: jobsData,
      pagination: {
        total: totalJobs,
        pages: Math.ceil(totalJobs / limit),
        currentPage: page,
        limit
      }
    };
    
    console.log('Sending response:', response);
    
    // Add cache control headers
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
    res.set('Expires', '0');
    res.set('Pragma', 'no-cache');
    
    res.json(response);
  } catch (error) {
    console.error('Error fetching jobs:', error);
    res.status(500).json({ error: 'Failed to fetch jobs' });
  }
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