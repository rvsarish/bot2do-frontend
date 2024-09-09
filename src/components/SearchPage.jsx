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

  const [showFilter, setShowFilter] = useState({
    unique_id: false,
    first_name: false,
    surname: false,
    village: false,
    state: false,
    country: false
  });

  const [frequentWords, setFrequentWords] = useState({
    unique_id: [],
    first_name: [],
    surname: [],
    village: [],
    state: [],
    country: []
  });

  const [filterSearch, setFilterSearch] = useState({
    unique_id: '',
    first_name: '',
    surname: '',
    village: '',
    state: '',
    country: ''
  });

  useEffect(() => {
    fetchFrequentWords();
  }, []);

  useEffect(() => {
    fetchData();
  }, [page, limit, search, filters]);

  const fetchFrequentWords = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/frequent-words');
      if (!response.ok) throw new Error('Failed to fetch frequent words.');
      const result = await response.json();
      setFrequentWords(result);
    } catch (error) {
      console.error('Error fetching frequent words:', error);
    }
  };

  const fetchData = async () => {
    try {
      const queryString = new URLSearchParams({ page, limit, ...filters });
      const response = await fetch(`http://localhost:5000/api/datas?${queryString.toString()}`);
      if (!response.ok) throw new Error('Failed to fetch data.');
      const result = await response.json();
      setData(result.data);
      setTotal(result.total);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleFilterChange = (e, field) => {
    setFilters({ ...filters, [field]: e.target.value });
    setPage(1);
  };

  const toggleFilterBox = (field) => {
    setShowFilter((prevState) => ({
      ...prevState,
      [field]: !prevState[field]
    }));
  };

  const applyFrequentFilter = (word, field) => {
    setFilters({ ...filters, [field]: word });
    setShowFilter({ ...showFilter, [field]: false });
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
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

  const handleBulkDelete = async () => {
    if (selectedItems.size === 0) {
      alert('No items selected for deletion.');
      return;
    }

    const confirmation = window.confirm('Are you sure you want to delete the selected items?');
    if (!confirmation) return;

    try {
      const response = await fetch('http://localhost:5000/api/datas/bulk-delete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ ids: Array.from(selectedItems) })
      });

      if (response.ok) {
        setSuccessMessage('Selected items deleted successfully.');
        fetchData(); // Re-fetch the updated data after deletion
        setSelectedItems(new Set()); // Clear selected items
      } else {
        const error = await response.json();
        alert(`Error: ${error.message}`);
      }
    } catch (error) {
      console.error('Error deleting selected items:', error);
    }
  };

  const handleFilterSearchChange = (e, field) => {
    setFilterSearch({ ...filterSearch, [field]: e.target.value });
  };

  const filteredOptions = (field) => {
    if (!Array.isArray(frequentWords[field]) || typeof filterSearch[field] !== 'string') {
      return [];
    }

    return frequentWords[field].filter((word) => {
      if (typeof word !== 'string') return false;
      return word.toLowerCase().includes(filterSearch[field].toLowerCase());
    });
  };

  const handleEdit = (item) => {
    // Add your edit logic here
    setEditingItem(item);
  };

  const handleDelete = async (uniqueId) => {
    const confirmation = window.confirm('Are you sure you want to delete this item?');
    if (!confirmation) return;

    try {
      const response = await fetch(`http://localhost:5000/api/datas/${uniqueId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        setSuccessMessage('Item deleted successfully.');
        fetchData();
      } else {
        const error = await response.json();
        alert(`Error: ${error.message}`);
      }
    } catch (error) {
      console.error('Error deleting item:', error);
    }
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
                  {['Unique ID', 'First Name', 'Surname', 'Village', 'State', 'Country'].map((column, index) => (
                    <th key={index} className="py-2 px-2 border-b relative">
                      {column}
                      <button
                        className="ml-2 text-gray-500 hover:text-gray-700"
                        onClick={() => toggleFilterBox(column.toLowerCase().replace(' ', '_'))}
                      >
                        <i className="fas fa-filter"></i>
                      </button>
                      {showFilter[column.toLowerCase().replace(' ', '_')] && (
                        <div className="absolute bg-white shadow-lg p-4 rounded-lg top-10 z-10">
                          <input
                            type="text"
                            placeholder={`Search ${column}`}
                            value={filterSearch[column.toLowerCase().replace(' ', '_')]}
                            onChange={(e) => handleFilterSearchChange(e, column.toLowerCase().replace(' ', '_'))}
                            className="w-full mb-2 px-2 py-1 border rounded-lg"
                          />
                          <div className="flex flex-col max-h-40 overflow-auto">
                            {filteredOptions(column.toLowerCase().replace(' ', '_')).map((word) => (
                              <label key={word}>
                                <input
                                  type="checkbox"
                                  onClick={() => applyFrequentFilter(word, column.toLowerCase().replace(' ', '_'))}
                                  className="mr-2"
                                />
                                {word}
                              </label>
                            ))}
                          </div>
                        </div>
                      )}
                    </th>
                  ))}
                  <th className="py-2 px-2 border-b">Actions</th>
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
                    <td className="py-2 px-2 border-b">{item.surname}</td>
                    <td className="py-2 px-2 border-b">{item.village}</td>
                    <td className="py-2 px-2 border-b">{item.state}</td>
                    <td className="py-2 px-2 border-b">{item.country}</td>
                    <td className="py-2 px-2 border-b">
                      <button
                        onClick={() => handleEdit(item)}
                        className="text-blue-500 hover:underline"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(item.unique_id)}
                        className="text-red-500 hover:underline ml-2"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-4">
            <button
              onClick={handleBulkDelete}
              className="bg-red-500 text-white px-4 py-2 rounded-md"
            >
              Delete Selected Items
            </button>
          </div>

          <div className="mt-4">
            {Array.from({ length: pageCount }, (_, i) => (
              <button
                key={i}
                onClick={() => handlePageChange(i + 1)}
                className={`mx-1 px-3 py-1 rounded-lg ${i + 1 === page ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
              >
                {i + 1}
              </button>
            ))}
          </div>

          {successMessage && (
            <div className="mt-4 text-green-500">
              {successMessage}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
