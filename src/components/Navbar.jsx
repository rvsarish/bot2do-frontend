import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto flex justify-between items-center p-4">
        <h1 className="text-2xl font-bold text-[#7695FF]">Dashboard</h1>
        <div className="space-x-4">
          {/* Using Link from react-router-dom for client-side routing */}
          <Link to="/" className="text-[#7695FF] hover:underline">
            Home
          </Link>
          <Link to="/dashboard" className="text-[#7695FF] hover:underline">
            Dashboard
          </Link>
          <Link to="/create-user" className="text-[#7695FF] hover:underline">
            Create User
          </Link>
          <Link to="/edit-user" className="text-[#7695FF] hover:underline">
            Edit User
          </Link>
          <Link to="/search" className="text-[#7695FF] hover:underline">
            Search
          </Link>
          {/* For Card 6 link, using navigate function to handle routing programmatically */}
          <button
            onClick={() => navigate('/search')}
            className="text-[#7695FF] hover:underline focus:outline-none"
          >
            Card 6
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
