import { useState, useEffect } from 'react';
import { jobApi } from '../services/jobApi';

export function JobList() {

interface Job {
        id: string;
        status: string;
        data: { topic: string };
        returnvalue: any;
        failedReason?: string;
    }
  const [jobs, setJobs] = useState<Job[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const jobsPerPage = 10;

  const fetchJobs = async () => {
    try {
      const response = await jobApi.fetchJobs(currentPage, jobsPerPage);
      if (response && response.jobs) {
        setJobs(response.jobs);
        if (response.pagination) {
          setTotalPages(response.pagination.pages);
        } else {
          setTotalPages(1);
        }
      }
    } catch (error) {
      console.error('Failed to fetch jobs:', error);
    }
  };

  useEffect(() => {
    fetchJobs();
    const interval = setInterval(fetchJobs, 5000);
    return () => clearInterval(interval);
  }, [currentPage]);

  return (
    <div className="mt-8">
      <h2 className="text-xl font-bold mb-4">Job List</h2>
      <div className="space-y-4">
        {jobs.map((job) => (
          <div key={job.id} className="p-4 border rounded grid grid-cols-3 gap-4">
            <div>
              <p><strong>ID:</strong> {job.id}</p>
            </div>
            <div>
              <p><strong>Status:</strong> {job.status}</p>
              {job.failedReason && (
                <p className="text-red-500"><strong>Error:</strong> {job.failedReason}</p>
              )}
              {job.returnvalue && (
                <p><strong>Result:</strong> {job.returnvalue}</p>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 flex justify-center space-x-2">
        <button
          onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
        >
          Previous
        </button>
        <span className="px-4 py-2">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
          disabled={currentPage === totalPages}
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
        >
          Next
        </button>
      </div>
    </div>
  );
} 