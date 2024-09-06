
import { useState, useEffect } from 'react';
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
      fetch(`http://localhost:5000/api/datas/${uniqueId}`)
        .then((response) => response.json())
        .then((data) => {
          setData(data);
          setIsEditing(false);
        })
        .catch((err) => console.error(err));
    }
  }, [uniqueId]);

  const handleSearch = () => {
    fetch(`http://localhost:5000/api/datas/${uniqueId}`)
      .then((response) => response.json())
      .then((data) => {
        setData(data);
        setIsEditing(false);
      })
      .catch((err) => {
        console.error(err);
        alert('Data not found');
      });
  };

  const handleCreateOrUpdate = (e) => {
    e.preventDefault();
    const url = isEditing
      ? `http://localhost:5000/api/datas/${formData.unique_id}`
      : 'http://localhost:5000/api/datas';
    const method = isEditing ? 'PUT' : 'POST';
    fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    })
      .then((response) => response.json())
      .then((data) => {
        alert('Data saved');
        setData(data);
        setIsEditing(false);
      })
      .catch((err) => console.error(err));
  };

  const handleDelete = () => {
    fetch(`http://localhost:5000/api/datas/${uniqueId}`, {
      method: 'DELETE',
    })
      .then((response) => response.json())
      .then(() => {
        alert('Data deleted');
        setData(null);
        setUniqueId('');
      })
      .catch((err) => console.error(err));
  };

  const handleLogout = () => {
    localStorage.removeItem('role');
    localStorage.removeItem('token');
    navigate('/');
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
        </div>
      </div>

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
