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
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/create-user" element={<CreateUser />} />
        <Route path="/edit-user" element={<EditUser />} />
        <Route path="/search" element={<SearchPage />} /> {/* New route */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
};

export default App;
