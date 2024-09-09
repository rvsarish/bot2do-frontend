import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';

const Dashboard = () => {
  const [uniqueId, setUniqueId] = useState('');
  const [data, setData] = useState(null);
  const [formData, setFormData] = useState({
    unique_id: '',
    first_name: '',
    middle_name: '',
    surname: '',
    village: '',
    address: '',
    pincode: '',
    state: '',
    country: '',
    phone_no1: '',
    phone_no2: '',
  });
  const [isEditing, setIsEditing] = useState(false);
  const role = localStorage.getItem('role'); // Get the role from localStorage
  const navigate = useNavigate();

  useEffect(() => {
    if (uniqueId) {
      fetchDataById(uniqueId);
    }
  }, [uniqueId]);

  const fetchDataById = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/datas/${id}`);
      if (!response.ok) {
        throw new Error('Data not found');
      }
      const data = await response.json();
      setData(data);
      setIsEditing(false);
    } catch (error) {
      console.error(error);
      alert('Data not found');
    }
  };

  const handleSearch = () => {
    if (uniqueId) {
      fetchDataById(uniqueId);
    } else {
      alert('Please enter a unique ID to search.');
    }
  };

  const handleCreateOrUpdate = async (e) => {
    e.preventDefault();
    const url = isEditing
      ? `http://localhost:5000/api/datas/${formData.unique_id}`
      : 'http://localhost:5000/api/datas';
    const method = isEditing ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to save data');
      }

      const data = await response.json();
      alert('Data saved');
      setData(data);
      setIsEditing(false);
    } catch (error) {
      console.error(error);
      alert('An error occurred while saving the data.');
    }
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/datas/${uniqueId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete data');
      }

      alert('Data deleted');
      setData(null);
      setUniqueId('');
    } catch (error) {
      console.error(error);
      alert('An error occurred while deleting the data.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('role');
    localStorage.removeItem('token');
    navigate('/');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <Navbar />

      <div className="container mx-auto mt-6">
        <div
          id="card6"
          className="bg-white p-6 rounded-lg shadow-lg cursor-pointer border-2 border-[#9DBDFF]"
        >
          <h2 className="text-2xl font-semibold mb-4 text-[#7695FF]">Card 6</h2>
          <p className="text-gray-700">Search Functionality</p>
          <input
            type="text"
            placeholder="Enter Unique ID"
            value={uniqueId}
            onChange={(e) => setUniqueId(e.target.value)}
            className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#7695FF] focus:border-[#7695FF]"
          />
          <button
            onClick={handleSearch}
            className="mt-4 px-4 py-2 bg-[#FF9874] text-white rounded-md hover:bg-[#FF7E6F] focus:outline-none focus:ring-2 focus:ring-[#FF7E6F] focus:ring-opacity-50"
          >
            Search
          </button>
        </div>
      </div>

      {data && (
        <div className="container mx-auto mt-6 bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-medium text-gray-800">Data Details</h3>
          <pre className="bg-gray-100 p-4 rounded">{JSON.stringify(data, null, 2)}</pre>
          <button
            onClick={handleDelete}
            className="mt-4 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
          >
            Delete
          </button>
        </div>
      )}

      <button
        onClick={handleLogout}
        className="mt-12 block mx-auto px-6 py-3 text-white bg-[#FF9874] rounded-md hover:bg-[#FF7E6F] focus:outline-none focus:ring-2 focus:ring-[#FF7E6F] focus:ring-opacity-50"
      >
        Logout
      </button>
    </div>
  );
};

export default Dashboard;
