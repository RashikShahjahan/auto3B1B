import express from "express";
import type { Request, Response } from "express";
import cors from "cors";
import startJob from "./workers/starter";
import {Queue} from 'bullmq';
import { prisma } from './utils/db';
const concatQueue = new Queue('output-videos');

const app = express();

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
    
    const jobs = await concatQueue.getJobs(['completed', 'failed', 'active', 'waiting']);
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
        
    
    res.json(response);
  } catch (error) {
    console.error('Error fetching jobs:', error);
    res.status(500).json({ error: 'Failed to fetch jobs' });
  }
});

app.post('/jobs', async (req: Request, res: Response) => {
  try {
    const { topic } = req.body;
    const job = await startJob(topic);
    await prisma.job.create({
      data: {
        id: job.jobId,
        status: 'waiting',
        data: { topic },
      },
    });
    res.json({ jobId: job.jobId });
  } catch (error) {
    console.error('Error creating job:', error);
    res.status(500).json({ error: 'Failed to create job' });
  }
});


app.listen(3000, () => {
  console.log("Server is running on port 3000");
});