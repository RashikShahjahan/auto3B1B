import { Toaster } from 'react-hot-toast';
import { JobForm } from './components/JobForm';
import { JobList } from './components/JobList';
import { Routes, Route } from 'react-router-dom';

function App() {
  return (
    <>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/" element={<JobForm />} />
        <Route path="/jobs" element={<JobList />} />
      </Routes>
    </>
  );
}

export default App;
