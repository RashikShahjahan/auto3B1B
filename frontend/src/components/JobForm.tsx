import { useState } from 'react';
import toast from 'react-hot-toast';
import { jobApi } from '../services/jobApi';

interface JobFormProps {
  onJobCreated?: () => void;
}

export function JobForm({ onJobCreated }: JobFormProps) {
  const [topic, setTopic] = useState('');

  const handleSubmit = async () => {
    try {
      const response = await jobApi.createJob(topic);
      toast.success(`Job created successfully! ID: ${response.jobId}`);
      setTopic(''); // Reset form
      onJobCreated?.(); // Notify parent
    } catch (error) {
      toast.error('Failed to create job. Please try again.');
    }
  };

  return (
    <>
      <textarea
        value={topic}
        onChange={(e) => setTopic(e.target.value)}
        placeholder="Enter your topic..."
        rows={4}
        className="w-full p-2 border rounded"
      />
      <button
        onClick={handleSubmit}
        className="mt-2 px-4 py-2 bg-blue-500 text-white rounded"
      >
        Generate Script
      </button>
    </>
  );
} 