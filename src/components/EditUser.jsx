import React, { useState, useEffect } from 'react';

const EditUser = () => {
  const [users, setUsers] = useState([]);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/users', {
          headers: {
            Authorization: `Bearer ${token}`, // Ensure token format is correct
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch users');
        }

        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error('Error fetching users:', error);
        alert('Failed to fetch users');
      }
    };

    if (token) {
      fetchUsers();
    } else {
      alert('User not authenticated');
    }
  }, [token]);

  const handleDeleteUser = async (userId) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this user?');
    if (!confirmDelete) return;

    try {
      const response = await fetch(`http://localhost:5000/api/users/${userId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete user');
      }

      alert('User deleted successfully');
      setUsers((prevUsers) => prevUsers.filter((user) => user._id !== userId));
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('Failed to delete user');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-4xl font-bold text-center mb-12 text-[#7695FF]">Edit User</h1>
      <div className="space-y-4">
        {users.length > 0 ? (
          users.map((user) => (
            <div
              key={user._id}
              className="bg-white p-6 rounded-lg shadow-md border-2 border-gray-300"
            >
              <h2 className="text-2xl font-semibold mb-4 text-[#7695FF]">{user.username}</h2>
              <button
                onClick={() => handleDeleteUser(user._id)}
                className="px-6 py-3 text-white bg-[#FF5C5C] rounded-md hover:bg-[#FF3333] focus:outline-none focus:ring-2 focus:ring-[#FF3333] focus:ring-opacity-50"
              >
                Delete User
              </button>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500">No users found.</p>
        )}
      </div>
    </div>
  );
};

export default EditUser;
