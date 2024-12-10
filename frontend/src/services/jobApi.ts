import axios from 'axios';

const BASE_URL = import.meta.env.VITE_BACKEND_URL;

interface JobResponse {
  id: string;
  status: string;
  data: { topic: string };
  returnvalue: any;
  failedReason?: string;
}

interface PaginationInfo {
  total: number;
  pages: number;
  currentPage: number;
  limit: number;
}

export const jobApi = {
  createJob: async (topic: string) => {
    const response = await axios.post(`${BASE_URL}/jobs`, 
      { topic },
      { withCredentials: true }
    );
    return response.data;
  },

  fetchJobs: async (page: number, limit: number) => {
    const response = await axios.get<{
      jobs: JobResponse[];
      pagination: PaginationInfo;
    }>(`${BASE_URL}/jobs?page=${page}&limit=${limit}`, 
      { withCredentials: true }
    );
    return response.data;
  }
}; 