import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto flex justify-between items-center p-4">
        <h1 className="text-2xl font-bold text-[#7695FF]">Dashboard</h1>
        <div className="space-x-4">
          <a href="/" className="text-[#7695FF] hover:underline">Home</a>
          <a href="/dashboard" className="text-[#7695FF] hover:underline">Dashboard</a>
          <a href="/create-user" className="text-[#7695FF] hover:underline">Create User</a>
          <a href="/edit-user" className="text-[#7695FF] hover:underline">Edit User</a>
          <a href="/search" className="text-[#7695FF] hover:underline">Search</a>
          <a
            href="#card6"
            className="text-[#7695FF] hover:underline"
            onClick={() => navigate('/search')}
          >
            Card 6
          </a>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
