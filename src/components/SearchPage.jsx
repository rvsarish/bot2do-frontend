import { useState, useEffect } from 'react';
import '@fortawesome/fontawesome-free/css/all.min.css';
import Navbar from './Navbar';

const SearchPage = () => {
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState('');
  const [editingItem, setEditingItem] = useState(null);
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  const [selectedItems, setSelectedItems] = useState(new Set());
  const [filters, setFilters] = useState({
    unique_id: '',
    first_name: '',
    surname: '',
    village: '',
    state: '',
    country: ''
  });

  useEffect(() => {
    fetchData();
  }, [page, limit, search, filters]);

  const fetchData = async () => {
    try {
      const queryString = new URLSearchParams({ page, limit, ...filters });
      const response = await fetch(`http://localhost:5000/api/datas?${queryString.toString()}`);
      const result = await response.json();
      setData(result.data);
      setTotal(result.total);
    } catch (error) {
      console.error(error);
    }
  };

  const handleFilterChange = (e, field) => {
    setFilters({ ...filters, [field]: e.target.value });
    setPage(1);
  };

  const handleDelete = async (uniqueId) => {
    try {
      await fetch(`http://localhost:5000/api/datas/${uniqueId}`, {
        method: 'DELETE',
      });
      fetchData(); 
      setSuccessMessage('Item deleted successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error(error);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedItems.size === 0) {
      alert('No items selected for deletion.');
      return;
    }

    const confirmDelete = window.confirm(
      `Are you sure you want to delete ${selectedItems.size} item(s)?`
    );

    if (confirmDelete) {
      try {
        await Promise.all(
          Array.from(selectedItems).map(id =>
            fetch(`http://localhost:5000/api/datas/${id}`, {
              method: 'DELETE',
            })
          )
        );
        setSelectedItems(new Set()); 
        fetchData();
        setSuccessMessage('Selected items deleted successfully!');
        setTimeout(() => setSuccessMessage(''), 3000);
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handleEdit = (item) => {
    setEditingItem({ ...item });
  };

  const handleUpdate = async () => {
    if (!editingItem) return;

    const newErrors = validateForm(editingItem);
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      await fetch(`http://localhost:5000/api/datas/${editingItem.unique_id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingItem),
      });
      setEditingItem(null);
      setSuccessMessage('Update successful!');
      fetchData();
      setTimeout(() => setSuccessMessage(''), 3000); 
    } catch (error) {
      console.error(error);
    }
  };

  const validateForm = (item) => {
    const errors = {};
    if (!item.first_name) errors.first_name = 'First name is required';
    if (!item.surname) errors.surname = 'Surname is required';
    
    return errors;
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPage(1); 
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const handleInputChange = (e, field) => {
    setEditingItem({ ...editingItem, [field]: e.target.value });
    setErrors({ ...errors, [field]: '' }); 
  };

  const handleSelectItem = (uniqueId) => {
    const updatedSelection = new Set(selectedItems);
    if (updatedSelection.has(uniqueId)) {
      updatedSelection.delete(uniqueId);
    } else {
      updatedSelection.add(uniqueId);
    }
    setSelectedItems(updatedSelection);
  };

  const pageCount = Math.ceil(total / limit);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <Navbar />
      <div className="py-6">
        <div className="bg-white p-4 rounded-lg shadow-md max-w-8xl">
          <input
            type="number"
            placeholder="Search by unique ID..."
            value={search}
            onChange={handleSearchChange}
            className="w-full px-4 py-2 mb-4 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
          />

          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-300">
              <thead>
                <tr>
                  <th className="py-2 px-2 border-b">
                    <input
                      type="checkbox"
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedItems(new Set(data.map(item => item.unique_id)));
                        } else {
                          setSelectedItems(new Set());
                        }
                      }}
                      checked={selectedItems.size === data.length}
                    />
                  </th>
                  <th className="py-2 px-2 border-b">Unique ID</th>
                  <th className="py-2 px-2 border-b">First Name</th>
                  <th className="py-2 px-2 border-b">Middle Name</th>
                  <th className="py-2 px-2 border-b">Surname</th>
                  <th className="py-2 px-2 border-b">Village</th>
                  <th className="py-2 px-2 border-b">Address</th>
                  <th className="py-2 px-2 border-b">Pincode</th>
                  <th className="py-2 px-2 border-b">State</th>
                  <th className="py-2 px-2 border-b">Country</th>
                  <th className="py-2 px-2 border-b">Phone No. 1</th>
                  <th className="py-2 px-2 border-b">Phone No. 2</th>
                  <th className="py-2 px-2 border-b">Actions</th>
                </tr>
                <tr>
                  <th className="py-2 px-2 border-b"></th>
                  <th className="py-2 px-2 border-b">
                    <input
                      type="text"
                      placeholder="Filter by Unique ID"
                      value={filters.unique_id}
                      onChange={(e) => handleFilterChange(e, 'unique_id')}
                      className="w-full px-2 py-1 border rounded-lg"
                    />
                  </th>
                  <th className="py-2 px-2 border-b">
                    <input
                      type="text"
                      placeholder="Filter by First Name"
                      value={filters.first_name}
                      onChange={(e) => handleFilterChange(e, 'first_name')}
                      className="w-full px-2 py-1 border rounded-lg"
                    />
                  </th>
                  <th className="py-2 px-2 border-b"></th>
                  <th className="py-2 px-2 border-b">
                    <input
                      type="text"
                      placeholder="Filter by Surname"
                      value={filters.surname}
                      onChange={(e) => handleFilterChange(e, 'surname')}
                      className="w-full px-2 py-1 border rounded-lg"
                    />
                  </th>
                  <th className="py-2 px-2 border-b">
                    <input
                      type="text"
                      placeholder="Filter by Village"
                      value={filters.village}
                      onChange={(e) => handleFilterChange(e, 'village')}
                      className="w-full px-2 py-1 border rounded-lg"
                    />
                  </th>
                  <th className="py-2 px-2 border-b"></th>
                  <th className="py-2 px-2 border-b"></th>
                  <th className="py-2 px-2 border-b">
                    <input
                      type="text"
                      placeholder="Filter by State"
                      value={filters.state}
                      onChange={(e) => handleFilterChange(e, 'state')}
                      className="w-full px-2 py-1 border rounded-lg"
                    />
                  </th>
                  <th className="py-2 px-2 border-b">
                    <input
                      type="text"
                      placeholder="Filter by Country"
                      value={filters.country}
                      onChange={(e) => handleFilterChange(e, 'country')}
                      className="w-full px-2 py-1 border rounded-lg"
                    />
                  </th>
                  <th className="py-2 px-2 border-b"></th>
                  <th className="py-2 px-2 border-b"></th>
                  <th className="py-2 px-2 border-b"></th>
                </tr>
              </thead>
              <tbody>
                {data.map(item => (
                  <tr key={item.unique_id}>
                    <td className="py-2 px-2 border-b">
                      <input
                        type="checkbox"
                        checked={selectedItems.has(item.unique_id)}
                        onChange={() => handleSelectItem(item.unique_id)}
                      />
                    </td>
                    <td className="py-2 px-2 border-b">{item.unique_id}</td>
                    <td className="py-2 px-2 border-b">{item.first_name}</td>
                    <td className="py-2 px-2 border-b">{item.middle_name}</td>
                    <td className="py-2 px-2 border-b">{item.surname}</td>
                    <td className="py-2 px-2 border-b">{item.village}</td>
                    <td className="py-2 px-2 border-b">{item.address}</td>
                    <td className="py-2 px-2 border-b">{item.pincode}</td>
                    <td className="py-2 px-2 border-b">{item.state}</td>
                    <td className="py-2 px-2 border-b">{item.country}</td>
                    <td className="py-2 px-2 border-b">{item.phone_no1}</td>
                    <td className="py-2 px-2 border-b">{item.phone_no2}</td>
                    <td className="py-2 px-2 border-b">
                      <button
                        className="text-blue-500 hover:text-blue-700"
                        onClick={() => handleEdit(item)}
                      >
                        <i className="fas fa-edit"></i>
                      </button>
                      <button
                        className="ml-2 text-red-500 hover:text-red-700"
                        onClick={() => handleDelete(item.unique_id)}
                      >
                        <i className="fas fa-trash"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex justify-between mt-4">
            <div>
              <span className="text-gray-700">Rows per page: </span>
              <select
                value={limit}
                onChange={(e) => setLimit(parseInt(e.target.value, 10))}
                className="ml-2 px-2 py-1 border border-gray-300 rounded-lg"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
            </div>

            <div>
              <button
                onClick={() => handlePageChange(page - 1)}
                disabled={page === 1}
                className="px-3 py-1 mx-1 text-white bg-gray-600 rounded disabled:bg-gray-300"
              >
                Previous
              </button>
              <span className="text-gray-700">
                Page {page} of {pageCount}
              </span>
              <button
                onClick={() => handlePageChange(page + 1)}
                disabled={page === pageCount}
                className="px-3 py-1 mx-1 text-white bg-gray-600 rounded disabled:bg-gray-300"
              >
                Next
              </button>
            </div>

            <button
              onClick={handleBulkDelete}
              className="px-3 py-1 text-white bg-red-500 rounded hover:bg-red-600"
            >
              Delete Selected
            </button>
          </div>

          {editingItem && (
            <div className="mt-6">
              <h3 className="text-xl font-semibold">Edit Item</h3>
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="block text-sm font-medium">First Name</label>
                  <input
                    type="text"
                    value={editingItem.first_name}
                    onChange={(e) => handleInputChange(e, 'first_name')}
                    className={`w-full px-3 py-2 border ${
                      errors.first_name ? 'border-red-500' : 'border-gray-300'
                    } rounded-lg`}
                  />
                  {errors.first_name && (
                    <span className="text-sm text-red-500">{errors.first_name}</span>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium">Middle Name</label>
                  <input
                    type="text"
                    value={editingItem.middle_name}
                    onChange={(e) => handleInputChange(e, 'middle_name')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium">Surname</label>
                  <input
                    type="text"
                    value={editingItem.surname}
                    onChange={(e) => handleInputChange(e, 'surname')}
                    className={`w-full px-3 py-2 border ${
                      errors.surname ? 'border-red-500' : 'border-gray-300'
                    } rounded-lg`}
                  />
                  {errors.surname && (
                    <span className="text-sm text-red-500">{errors.surname}</span>
                  )}
                </div>
              </div>
              <div className="flex justify-end mt-4">
                <button
                  onClick={handleUpdate}
                  className="px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600"
                >
                  Save Changes
                </button>
              </div>
            </div>
          )}

          {successMessage && (
            <div className="mt-4 text-green-600 font-semibold">
              {successMessage}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
