import { Toaster } from 'react-hot-toast';
import { JobForm } from './components/JobForm';
import { JobList } from './components/JobList';

function App() {
  return (
    <>
      <Toaster position="top-right" />
      <JobForm />
      <JobList />
    </>
  );
}

export default App;
