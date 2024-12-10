import  { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Toaster } from 'react-hot-toast';

function App() {
  const [topic, setTopic] = useState('');

  const handleSubmit = async () => {
    try {
      const response = await axios.post('http://localhost:3000/jobs', { topic });
      toast.success(`Job created successfully! ID: ${response.data.jobId}`);
    } catch (error) {
      toast.error('Failed to create job. Please try again.');
    }
  };

  return (
    <>
      <Toaster position="top-right" />
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
  )
}

export default App
