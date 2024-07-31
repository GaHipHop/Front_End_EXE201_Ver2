import CreateIcon from '@mui/icons-material/Create';
import DeleteIcon from '@mui/icons-material/Delete';
import UpdateIcon from '@mui/icons-material/Update';
import React, { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { availableDiscount, deletetDiscount, getAllDiscount, getAllDiscountFalse, GetDiscountBy, postcreateDiscount, updateDiscount } from "../../../lib/service/discountService";
import AdminHeader from "../adminLayout/AdminHeader";
import Sidebar from "../adminLayout/Sidebar";

function AdminDiscount() {
  const [discounts, setDiscounts] = useState([]);
  const [filteredDiscount, setFilteredDiscount] = useState([]);
  const [dropdownVisible, setDropdownVisible] = useState(null);
  const [selectedDiscount, setSelectedDiscount] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [newDiscountPercent, setNewDiscountPercent] = useState("");
  const [newDiscountExpiredDate, setNewDiscountExpiredDate] = useState("");
  const [currentFilter, setCurrentFilter] = useState('true');

  const fetchDiscounts = async (filter) => {
    const token = localStorage.getItem('token');
    try {
      let response;
      if (filter === 'true') {
        response = await getAllDiscount();
      } else {
        response = await getAllDiscountFalse(token);
      }

      if (response.data.status === 404) {
        setDiscounts([]);
        setFilteredDiscount([]);
        toast.error("No discount available");
      } else {
        setDiscounts(response.data.data || []);
        setFilteredDiscount(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching discounts:", error);
      setDiscounts([]);
      setFilteredDiscount([]);
    }
  };

  useEffect(() => {
    fetchDiscounts(currentFilter);
  }, [currentFilter]);

  const handleSearch = (event) => {
    const searchTerm = event.target.value.toLowerCase();
    const filtered = discounts.filter(discount =>
      discount.percent.toString().includes(searchTerm) ||
      new Date(discount.expiredDate).toLocaleDateString().toLowerCase().includes(searchTerm)
    );
    setFilteredDiscount(filtered);
  };

  const handleUpdate = async (discountId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await GetDiscountBy(discountId, token);
      const discountData = response.data.data;
      discountData.expiredDate = new Date(discountData.expiredDate).toISOString().split('T')[0];
      setSelectedDiscount(discountData);
      setShowPopup(true);
    } catch (error) {
      console.error("Error fetching discount details:", error);
      toast.error("Error fetching discount details: " + error.message);
    }
  };

  const handleDelete = async (discountId) => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error("No token found in local storage.");
      toast.error("No token found in local storage.");
      return;
    }

    try {
      if (currentFilter === 'true') {
        await deletetDiscount(discountId, token);
        toast.success("Discount deleted successfully.");
      } else if (currentFilter === 'false') {
        await availableDiscount(discountId, token);
        toast.success("Discount set to available successfully.");
      }
      fetchDiscounts(currentFilter);
    } catch (error) {
      console.error("Error processing request:", error);
      toast.error("Error processing request: " + error.message);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSelectedDiscount((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error("No token found in local storage.");
      toast.error("No token found in local storage.");
      return;
    }

    if (!selectedDiscount.id || !selectedDiscount.percent || !selectedDiscount.expiredDate) {
      console.error("Missing required fields in selectedDiscount:", selectedDiscount);
      toast.error("Missing required fields in selectedDiscount.");
      return;
    }

    try {
      await updateDiscount(selectedDiscount.id, selectedDiscount, token);
      setShowPopup(false);
      fetchDiscounts(currentFilter);
      toast.success("Discount updated successfully.");
    } catch (error) {
      console.error("Error updating discount:", error);
      if (error.response) {
        toast.error("Error updating discount: " + error.response.data.message);
      } else {
        toast.error("Error updating discount: " + error.message);
      }
    }
  };

  const handleCreate = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error("No token found in local storage.");
      toast.error("No token found in local storage.");
      return;
    }

    if (!newDiscountPercent || !newDiscountExpiredDate) {
      console.error("Percent and expired date are required.");
      toast.error("Percent and expired date are required.");
      return;
    }

    const newDiscount = {
      percent: newDiscountPercent,
      expiredDate: newDiscountExpiredDate,
      status: currentFilter === 'true'
    };

    try {
      await postcreateDiscount(newDiscount, token);
      setShowPopup(false);
      fetchDiscounts(currentFilter);
      toast.success("Discount created successfully.");
    } catch (error) {
      console.error("Error creating discount:", error);
      toast.error("Error creating discount: " + error.message);
    }
  };

  const openCreatePopup = () => {
    setIsCreating(true);
    setShowPopup(true);
  };

  const closePopup = () => {
    setShowPopup(false);
    setSelectedDiscount(null);
    setIsCreating(false);
    setNewDiscountPercent("");
    setNewDiscountExpiredDate("");
  };

  const handleFilterChange = (filter) => {
    setCurrentFilter(filter);
  };

  function DiscountTable({ discounts }) {
    return (
      <section className="flex flex-col items-start text-base font-medium tracking-tight text-center text-black max-md:flex-wrap max-md:pr-5">
        <div className="flex justify-between w-full px-2.5 py-2.5 bg-white">
          <div className="flex-1 flex justify-center items-center">
            <span>No</span>
          </div>
          <div className="flex-1 flex justify-center items-center">
            <span>Discount ID</span>
          </div>
          <div className="flex-1 flex justify-center items-center">
            <span>Percent</span>
          </div>
          <div className="flex-1 flex justify-center items-center">
            <span>Expired Date</span>
          </div>
          <div className="flex-1 flex justify-center items-center">
            <span>Action</span>
          </div>
        </div>
        {discounts.length > 0 ? (
          discounts.map((discount, index) => (
          <div
            key={index}
            className="relative flex justify-between w-full px-2.5 py-2.5 text-base tracking-tight text-black bg-white max-md:flex-wrap"
          >
            <div className="flex-1 flex justify-center items-center text-center font-plus-jakarta break-words">
              {index + 1}
            </div>
            <div className="flex-1 flex justify-center items-center text-center font-plus-jakarta break-words">
              {discount.id}
            </div>
            <div className="flex-1 flex justify-center items-center text-center font-plus-jakarta break-words">
              <span>{discount.percent}%</span>
            </div>
            <div className="flex-1 flex justify-center items-center text-center font-plus-jakarta break-words">
              <span>{new Date(discount.expiredDate).toLocaleDateString()}</span>
            </div>
            <div className="flex-1 flex justify-center items-center text-center font-plus-jakarta break-words relative">
              <span onClick={() => setDropdownVisible(index)}>...</span>
              {dropdownVisible === index && (
                <div
                  className="absolute top-full mt-2 shadow-lg border rounded"
                  style={{
                    backgroundColor: '#ffffff',
                    border: '1px solid #e0e0e0',
                    zIndex: 10
                  }}
                >
                  <ul>
                    {currentFilter === 'true' && (
                      <li className="p-2 cursor-pointer flex items-center" onClick={() => handleUpdate(discount.id)}>
                        <UpdateIcon className="mr-2" /> Update
                      </li>
                    )}
                    <li className="p-2 cursor-pointer flex items-center" onClick={() => handleDelete(discount.id)}>
                      <DeleteIcon className="mr-2" /> {currentFilter === 'true' ? 'Delete' : 'Available'}
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        ))
      ) : (
        <div className="flex justify-center w-full px-2.5 py-2.5 text-base tracking-tight text-black bg-white max-md:flex-wrap">
          No discount available
        </div>
      )}
      </section>
    );
  }

  return (
    <div className="h-screen bg-white flex">
      <Sidebar />
      <main className="flex flex-col w-full overflow-auto">
        <header className="admin-header">
          <AdminHeader title="Manage Discounts" />
        </header>
        <style>
          {`
            .custom-button {
              color: black;
              background-color: #d3d3d3;
              padding: 8px 16px;
              border-radius: 8px;
              cursor: pointer;
            }

            .custom-button.selected {
              background-color: #f4bbff;
            }

            .custom-button:hover {
              background-color: lightgray;
            }
          `}
        </style>
        <section className="flex flex-col px-6 pt-6 mt-4 bg-white border-t border-solid border-black border-opacity-30 max-md:pr-5 max-md:max-w-full">
          <div className="search-and-tabs mx-4 max-md:mr-2.5 max-md:max-w-full flex justify-between items-center">
            <div className="flex space-x-4 w-full justify-between items-center">
              <input
                type="text"
                placeholder="Search..."
                className="px-3 py-1.5 rounded-2xl border border-gray-300 focus:outline-none focus:border-pink-300 w-1/3"
                onChange={handleSearch}
              />
              <div className="flex space-x-4">
                <button className={`custom-button ${currentFilter === 'true' ? 'selected' : ''}`} onClick={() => handleFilterChange('true')}>Available</button>
                <button className={`custom-button ${currentFilter === 'false' ? 'selected' : ''}`} onClick={() => handleFilterChange('false')}>UnAvailable</button>
              </div>
            </div>
          </div>
          <div className="mx-4 max-md:mr-2.5 max-md:max-w-full mt-4">
            <button
              className="custom-button"
              onClick={openCreatePopup}
              style={{ marginBottom: '16px' }}
            >
              <CreateIcon className="mr-2" /> Create
            </button>
            <DiscountTable discounts={filteredDiscount} />
          </div>
        </section>
        {showPopup && (
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="absolute inset-0 bg-black opacity-50"></div>
            <div className="bg-white p-6 rounded-md shadow-lg z-10">
              <h2 className="text-xl font-bold mb-4">{isCreating ? "Create Discount" : "Discount Details"}</h2>
              <form>
                {isCreating ? (
                  <>
                    <div className="mb-4">
                      <label className="block text-gray-700 text-sm font-bold mb-2">
                        Percent
                      </label>
                      <input
                        type="number"
                        name="newDiscountPercent"
                        value={newDiscountPercent}
                        onChange={(e) => setNewDiscountPercent(e.target.value)}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      />
                    </div>
                    <div className="mb-4">
                      <label className="block text-gray-700 text-sm font-bold mb-2">
                        Expired Date
                      </label>
                      <input
                        type="date"
                        name="newDiscountExpiredDate"
                        value={newDiscountExpiredDate}
                        onChange={(e) => setNewDiscountExpiredDate(e.target.value)}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <button
                        type="button"
                        className="custom-button"
                        onClick={handleCreate}
                      >
                        Create
                      </button>
                      <button
                        type="button"
                        className="custom-button"
                        onClick={closePopup}
                      >
                        Cancel
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="mb-4">
                      <label className="block text-gray-700 text-sm font-bold mb-2">
                        ID
                      </label>
                      <input
                        type="text"
                        name="id"
                        value={selectedDiscount.id}
                        readOnly
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      />
                    </div>
                    <div className="mb-4">
                      <label className="block text-gray-700 text-sm font-bold mb-2">
                        Percent
                      </label>
                      <input
                        type="number"
                        name="percent"
                        value={selectedDiscount.percent}
                        onChange={handleChange}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      />
                    </div>
                    <div className="mb-4">
                      <label className="block text-gray-700 text-sm font-bold mb-2">
                        Expired Date
                      </label>
                      <input
                        type="date"
                        name="expiredDate"
                        value={selectedDiscount.expiredDate}
                        onChange={handleChange}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      />
                    </div>
                    <div className="mb-4">
                      <label className="block text-gray-700 text-sm font-bold mb-2">
                        Status
                      </label>
                      <select
                        name="status"
                        value={selectedDiscount.status}
                        onChange={handleChange}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      >
                        <option value={true}>Active</option>
                        <option value={false}>Inactive</option>
                      </select>
                    </div>
                    <div className="flex items-center justify-between">
                      <button
                        type="button"
                        className="custom-button"
                        onClick={handleSave}
                      >
                        Save
                      </button>
                      <button
                        type="button"
                        className="custom-button"
                        onClick={closePopup}
                      >
                        Cancel
                      </button>
                    </div>
                  </>
                )}
              </form>
            </div>
          </div>
        )}
        <ToastContainer />
      </main>
    </div>
  );
}

export default AdminDiscount;
