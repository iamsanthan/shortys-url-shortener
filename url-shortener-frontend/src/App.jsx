import UrlForm from './components/UrlForm';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <>
      <UrlForm />
      <ToastContainer />
    </>
  );
}

export default App; // ✅ This line is required
