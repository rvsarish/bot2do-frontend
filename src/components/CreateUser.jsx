import { useState } from 'react';

const CreateUser = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');

  const handleCreateUser = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

      const response = await fetch('http://localhost:5000/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
        body: JSON.stringify({ username, password, role }),
      });

      if (response.ok) {
        alert('User created successfully');
      } else {
        alert('Failed to create user');
      }
    
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-6">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center text-[#7695FF]">Create User</h2>
        <form onSubmit={handleCreateUser} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-[#7695FF] focus:border-[#7695FF]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-[#7695FF] focus:border-[#7695FF]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-[#7695FF] focus:border-[#7695FF]"
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <button
            type="submit"
            className="w-full px-4 py-2 text-white bg-[#FF9874] rounded-md hover:bg-[#FF7E6F] focus:outline-none focus:ring-2 focus:ring-[#FF7E6F] focus:ring-opacity-50"
          >
            Create User
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateUser;
