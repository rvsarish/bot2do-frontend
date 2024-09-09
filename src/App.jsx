// Import necessary modules from 'react-router-dom'
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import CreateUser from './components/CreateUser';
import EditUser from './components/EditUser';
import SearchPage from './components/SearchPage';

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Define all the routes with corresponding components */}
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/create-user" element={<CreateUser />} />
        <Route path="/edit-user" element={<EditUser />} />
        <Route path="/search" element={<SearchPage />} /> {/* New route */}
        {/* Catch-all route that redirects to Login */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

export default App;
