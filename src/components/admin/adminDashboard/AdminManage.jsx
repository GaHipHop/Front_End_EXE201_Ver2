import CreateIcon from '@mui/icons-material/Create';
import DeleteIcon from '@mui/icons-material/Delete';
import UpdateIcon from '@mui/icons-material/Update';
import React, { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { deletetAdmin, getAdminById, getAllAdminByStatusFalse, getAllAdminByStatusTrue, postcreateAdmin, updateAdmin } from "../../../lib/service/adminService";
import AdminHeader from "../adminLayout/AdminHeader";
import Sidebar from "../adminLayout/Sidebar";

function AdminManage() {
  const [admins, setAdmins] = useState([]);
  const [filteredAdmin, setFilteredAdmin] = useState([]);
  const [dropdownVisible, setDropdownVisible] = useState(null);
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [newAdmin, setNewAdmin] = useState({
    userName: "",
    email: "",
    fullName: "",
    phone: "",
    address: "",
    password: ""
  });
  const [currentFilter, setCurrentFilter] = useState('true');

  const fetchAdmins = async (filter) => {
    const token = localStorage.getItem('token');
    try {
      let response;
      if (filter === 'true') {
        response = await getAllAdminByStatusTrue(token);
      } else {
        response = await getAllAdminByStatusFalse(token);
      }
      setAdmins(response.data.data || []);
      setFilteredAdmin(response.data.data);
    } catch (error) {
      console.error("Error fetching admins:", error);
      setAdmins([]);
    }
  };

  useEffect(() => {
    fetchAdmins(currentFilter);
  }, [currentFilter]);

  const handleSearch = (event) => {
    const searchTerm = event.target.value.toLowerCase();
    const filtered = admins.filter(admin =>
      admin.userName.toLowerCase().includes(searchTerm) ||
      admin.email.toLowerCase().includes(searchTerm)
    );
    setFilteredAdmin(filtered);
  };

  const handleUpdate = async (adminId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await getAdminById(adminId, token);
      setSelectedAdmin(response.data.data);
      setShowPopup(true);
    } catch (error) {
      console.error("Error fetching admin details:", error);
    }
  };

  const handleDelete = async (adminId) => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error("No token found in local storage.");
      return;
    }

    try {
      await deletetAdmin(adminId, token);
      fetchAdmins(currentFilter);
      toast.success('Admin deleted successfully.');
    } catch (error) {
      console.error("Error deleting admin:", error);
      toast.error('Failed to delete admin.');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSelectedAdmin((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error("No token found in local storage.");
      return;
    }

    if (!selectedAdmin || !selectedAdmin.userName || !selectedAdmin.email || !selectedAdmin.password) {
      console.error("Missing required fields in selectedAdmin:", selectedAdmin);
      toast.error('Please fill in all required fields.');
      return;
    }

    try {
      const response = await updateAdmin(selectedAdmin.id, selectedAdmin, token);
      setShowPopup(false);
      fetchAdmins(currentFilter);
      toast.success('Admin updated successfully.');
    } catch (error) {
      console.error("Error updating admin:", error);
      if (error.response) {
        console.error("Error response data:", error.response.data);
        console.error("Response status:", error.response.status);
        console.error("Response headers:", error.response.headers);
        console.error("Validation errors:", error.response.data.errors);
        if (error.response.data.errors) {
          Object.keys(error.response.data.errors).forEach((key) => {
            toast.error(`${key}: ${error.response.data.errors[key].join(', ')}`);
          });
        }
      }
      toast.error(error.response.data.message);
    }
  };

  const handleCreate = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error("No token found in local storage.");
      return;
    }

    if (!newAdmin.userName || !newAdmin.email || !newAdmin.password) {
      console.error("User Name, Email, and Password are required.");
      toast.error('Please fill in all required fields.');
      return;
    }

    try {
      await postcreateAdmin(newAdmin, token);
      setShowPopup(false);
      fetchAdmins(currentFilter);
      toast.success('Admin created successfully.');
    } catch (error) {
      console.error("Error creating admin:", error);
      if (error.response) {
        console.error("Error response data:", error.response.data);
        if (error.response.data.errors) {
          Object.keys(error.response.data.errors).forEach((key) => {
            toast.error(`${key}: ${error.response.data.errors[key].join(', ')}`);
          });
        }
      }
      toast.error(`${error.response.data.message}`);
    }
  };

  const openCreatePopup = () => {
    setIsCreating(true);
    setShowPopup(true);
  };

  const closePopup = () => {
    setShowPopup(false);
    setSelectedAdmin(null);
    setIsCreating(false);
    setNewAdmin({
      userName: "",
      email: "",
      fullName: "",
      phone: "",
      address: "",
      password: ""
    });
  };

  const handleFilterChange = (filter) => {
    setCurrentFilter(filter);
  };

  function AdminTable({ admins }) {
    return (
      <section className="flex flex-col items-start text-base font-medium tracking-tight text-center text-black max-md:flex-wrap max-md:pr-5">
        <div className="flex justify-between w-full px-2.5 py-2.5 bg-white">
          <div className="flex-1 flex justify-center items-center">
            <span>No</span>
          </div>
          <div className="flex-1 flex justify-center items-center">
            <span>Admin ID</span>
          </div>
          <div className="flex-1 flex justify-center items-center">
            <span>User Name</span>
          </div>
          <div className="flex-1 flex justify-center items-center">
            <span>Email</span>
          </div>
          <div className="flex-1 flex justify-center items-center">
            <span>Full Name</span>
          </div>
          <div className="flex-1 flex justify-center items-center">
            <span>Phone</span>
          </div>
          <div className="flex-1 flex justify-center items-center">
            <span>Address</span>
          </div>
          <div className="flex-1 flex justify-center items-center">
            <span>Status</span>
          </div>
          <div className="flex-1 flex justify-center items-center">
            <span>Action</span>
          </div>
        </div>
        {admins.map((admin, index) => (
          <div
            key={index}
            className="relative flex justify-between w-full px-2.5 py-2.5 text-base tracking-tight text-black bg-white max-md:flex-wrap"
          >
            <div className="flex-1 flex justify-center items-center text-center font-plus-jakarta break-words">
              {index + 1}
            </div>
            <div className="flex-1 flex justify-center items-center text-center font-plus-jakarta break-words">
              {admin.id}
            </div>
            <div className="flex-1 flex justify-center items-center text-center font-plus-jakarta break-words">
              <span>{admin.userName}</span>
            </div>
            <div className="flex-1 flex justify-center items-center text-center font-plus-jakarta break-words">
              <span>{admin.email}</span>
            </div>
            <div className="flex-1 flex justify-center items-center text-center font-plus-jakarta break-words">
              <span>{admin.fullName}</span>
            </div>
            <div className="flex-1 flex justify-center items-center text-center font-plus-jakarta break-words">
              <span>{admin.phone}</span>
            </div>
            <div className="flex-1 flex justify-center items-center text-center font-plus-jakarta break-words">
              <span>{admin.address}</span>
            </div>
            <div className="flex-1 flex justify-center items-center text-center font-plus-jakarta break-words">
              <span>{admin.status ? "Active" : "Inactive"}</span>
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
                    <li className="p-2 cursor-pointer flex items-center" onClick={() => handleUpdate(admin.id)}>
                      <UpdateIcon className="mr-2" /> Update
                    </li>
                    <li className="p-2 cursor-pointer flex items-center" onClick={() => handleDelete(admin.id)}>
                      <DeleteIcon className="mr-2" /> Delete
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        ))}
      </section>
    );
  }

  return (
    <div className="h-screen bg-white flex">
      <Sidebar />
      <main className="flex flex-col w-full overflow-auto">
        <header className="admin-header">
          <AdminHeader title="Manage Admins" />
        </header>
        <style>
          {`
            .custom-button {
              color: black;
              background-color: #d3d3d3;
              padding: 8px 16px;
              border-radius: 8px;
              text-transform: uppercase;
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
                <button className={`custom-button ${currentFilter === 'true' ? 'selected' : ''}`} onClick={() => handleFilterChange('true')}>True</button>
                <button className={`custom-button ${currentFilter === 'false' ? 'selected' : ''}`} onClick={() => handleFilterChange('false')}>False</button>
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
            <AdminTable admins={filteredAdmin} />
          </div>
        </section>
        {showPopup && (
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="absolute inset-0 bg-black opacity-50"></div>
            <div className="bg-white p-6 rounded-md shadow-lg z-10">
              <h2 className="text-xl font-bold mb-4">{isCreating ? "Create Admin" : "Admin Details"}</h2>
              <form>
                {isCreating ? (
                  <>
                    <div className="mb-4">
                      <label className="block text-gray-700 text-sm font-bold mb-2">
                        User Name
                      </label>
                      <input
                        type="text"
                        name="userName"
                        value={newAdmin.userName}
                        onChange={(e) => setNewAdmin({ ...newAdmin, userName: e.target.value })}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      />
                    </div>
                    <div className="mb-4">
                      <label className="block text-gray-700 text-sm font-bold mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={newAdmin.email}
                        onChange={(e) => setNewAdmin({ ...newAdmin, email: e.target.value })}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      />
                    </div>
                    <div className="mb-4">
                      <label className="block text-gray-700 text-sm font-bold mb-2">
                        Full Name
                      </label>
                      <input
                        type="text"
                        name="fullName"
                        value={newAdmin.fullName}
                        onChange={(e) => setNewAdmin({ ...newAdmin, fullName: e.target.value })}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      />
                    </div>
                    <div className="mb-4">
                      <label className="block text-gray-700 text-sm font-bold mb-2">
                        Phone
                      </label>
                      <input
                        type="text"
                        name="phone"
                        value={newAdmin.phone}
                        onChange={(e) => setNewAdmin({ ...newAdmin, phone: e.target.value })}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      />
                    </div>
                    <div className="mb-4">
                      <label className="block text-gray-700 text-sm font-bold mb-2">
                        Address
                      </label>
                      <input
                        type="text"
                        name="address"
                        value={newAdmin.address}
                        onChange={(e) => setNewAdmin({ ...newAdmin, address: e.target.value })}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      />
                    </div>
                    <div className="mb-4">
                      <label className="block text-gray-700 text-sm font-bold mb-2">
                        Password
                      </label>
                      <input
                        type="password"
                        name="password"
                        value={newAdmin.password}
                        onChange={(e) => setNewAdmin({ ...newAdmin, password: e.target.value })}
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
                        value={selectedAdmin.id}
                        readOnly
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      />
                    </div>
                    <div className="mb-4">
                      <label className="block text-gray-700 text-sm font-bold mb-2">
                        User Name
                      </label>
                      <input
                        type="text"
                        name="userName"
                        value={selectedAdmin.userName}
                        onChange={handleChange}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      />
                    </div>
                    <div className="mb-4">
                      <label className="block text-gray-700 text-sm font-bold mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={selectedAdmin.email}
                        onChange={handleChange}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      />
                    </div>
                    <div className="mb-4">
                      <label className="block text-gray-700 text-sm font-bold mb-2">
                        Full Name
                      </label>
                      <input
                        type="text"
                        name="fullName"
                        value={selectedAdmin.fullName}
                        onChange={handleChange}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      />
                    </div>
                    <div className="mb-4">
                      <label className="block text-gray-700 text-sm font-bold mb-2">
                        Phone
                      </label>
                      <input
                        type="text"
                        name="phone"
                        value={selectedAdmin.phone}
                        onChange={handleChange}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      />
                    </div>
                    <div className="mb-4">
                      <label className="block text-gray-700 text-sm font-bold mb-2">
                        Address
                      </label>
                      <input
                        type="text"
                        name="address"
                        value={selectedAdmin.address}
                        onChange={handleChange}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      />
                    </div>
                    <div className="mb-4">
                      <label className="block text-gray-700 text-sm font-bold mb-2">
                        Password
                      </label>
                      <input
                        type="password"
                        name="password"
                        value={selectedAdmin.password}
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
                        value={selectedAdmin.status}
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
      </main>
      <ToastContainer />
    </div>
  );
}

export default AdminManage;
