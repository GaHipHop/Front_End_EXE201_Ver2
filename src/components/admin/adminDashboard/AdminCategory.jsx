import CreateIcon from '@mui/icons-material/Create';
import DeleteIcon from '@mui/icons-material/Delete';
import UpdateIcon from '@mui/icons-material/Update';
import React, { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { deleteCategory, getAllCategory, getAllCategoryFalse, GetCategoryById, postcreateCategory, updateCategory } from "../../../lib/service/categoryService";
import AdminHeader from "../adminLayout/AdminHeader";
import Sidebar from "../adminLayout/Sidebar";

function AdminCategory() {
  const [categories, setCategories] = useState([]);
  const [filteredCategory, setFilteredCategory] = useState([]);
  const [dropdownVisible, setDropdownVisible] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [currentFilter, setCurrentFilter] = useState('true');

  const fetchCategories = async (filter) => {
    const token = localStorage.getItem('token');
    try {
      let response;
      if (filter === 'true') {
        response = await getAllCategory();
      } else {
        response = await getAllCategoryFalse(token);
      }
      setCategories(response.data.data.result || []);
      setFilteredCategory(response.data.data.result);
    } catch (error) {
      console.error("Error fetching categories:", error);
      setCategories([]);
      toast.error("Error fetching categories: " + error.message);
    }
  };

  useEffect(() => {
    fetchCategories(currentFilter);
  }, [currentFilter]);

  const handleSearch = (event) => {
    const searchTerm = event.target.value.toLowerCase();
    const filtered = categories.filter(category =>
      category.categoryName.toLowerCase().includes(searchTerm)
    );
    setFilteredCategory(filtered);
  };

  const handleUpdate = async (categoryId) => {
    try {
      const response = await GetCategoryById(categoryId);
      setSelectedCategory(response.data.data);
      setShowPopup(true);
    } catch (error) {
      console.error("Error fetching category details:", error);
      toast.error("Error fetching category details: " + error.message);
    }
  };

  const handleDelete = async (categoryId) => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error("No token found in local storage.");
      toast.error("No token found in local storage.");
      return;
    }

    try {
      await deleteCategory(categoryId, token);
      fetchCategories(currentFilter);
      toast.success("Category deleted successfully.");
    } catch (error) {
      console.error("Error deleting category:", error);
      toast.error("Error deleting category: " + error.message);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSelectedCategory((prev) => ({
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

    if (!selectedCategory.id || !selectedCategory.categoryName) {
      console.error("Missing required fields in selectedCategory:", selectedCategory);
      toast.error("Missing required fields in selectedCategory.");
      return;
    }

    try {
      await updateCategory(selectedCategory.id, selectedCategory, token);
      setShowPopup(false);
      fetchCategories(currentFilter);
      toast.success("Category updated successfully.");
    } catch (error) {
      console.error("Error updating category:", error);
      if (error.response) {
        toast.error("Error updating category: " + error.response.data.message);
      } else {
        toast.error("Error updating category: " + error.message);
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

    if (!newCategoryName) {
      console.error("Category name is required.");
      toast.error("Category name is required.");
      return;
    }

    const newCategory = {
      categoryName: newCategoryName,
    };

    try {
      await postcreateCategory(newCategory, token);
      setShowPopup(false);
      fetchCategories(currentFilter);
      toast.success("Category created successfully.");
    } catch (error) {
      console.error("Error creating category:", error);
      toast.error(error.response.data.message);
    }
  };

  const openCreatePopup = () => {
    setIsCreating(true);
    setShowPopup(true);
  };

  const closePopup = () => {
    setShowPopup(false);
    setSelectedCategory(null);
    setIsCreating(false);
    setNewCategoryName("");
  };

  const handleFilterChange = (filter) => {
    setCurrentFilter(filter);
  };

  function CategoryTable({ categories }) {
    return (
      <section className="flex flex-col items-start text-base font-medium tracking-tight text-center text-black max-md:flex-wrap max-md:pr-5">
        <div className="flex justify-between w-full px-2.5 py-2.5 bg-white">
          <div className="flex-1 flex justify-center items-center">
            <span>No</span>
          </div>
          <div className="flex-1 flex justify-center items-center">
            <span>Categories ID</span>
          </div>
          <div className="flex-1 flex justify-center items-center">
            <span>Category Name</span>
          </div>
          <div className="flex-1 flex justify-center items-center">
            <span>Action</span>
          </div>
        </div>
        {categories.map((category, index) => (
          <div
            key={index}
            className="relative flex justify-between w-full px-2.5 py-2.5 text-base tracking-tight text-black bg-white max-md:flex-wrap"
          >
            <div className="flex-1 flex justify-center items-center text-center font-plus-jakarta break-words">
              {index + 1}
            </div>
            <div className="flex-1 flex justify-center items-center text-center font-plus-jakarta break-words">
              {category.id}
            </div>
            <div className="flex-1 flex justify-center items-center text-center font-plus-jakarta break-words">
              <span>{category.categoryName}</span>
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
                    <li className="p-2 cursor-pointer flex items-center" onClick={() => handleUpdate(category.id)}>
                      <UpdateIcon className="mr-2" /> Update
                    </li>
                    <li className="p-2 cursor-pointer flex items-center" onClick={() => handleDelete(category.id)}>
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
          <AdminHeader title="Manage Categories" />
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
            <CategoryTable categories={filteredCategory} />
          </div>
        </section>
        {showPopup && (
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="absolute inset-0 bg-black opacity-50"></div>
            <div className="bg-white p-6 rounded-md shadow-lg z-10">
              <h2 className="text-xl font-bold mb-4">{isCreating ? "Create Category" : "Category Details"}</h2>
              <form>
                {isCreating ? (
                  <>
                    <div className="mb-4">
                      <label className="block text-gray-700 text-sm font-bold mb-2">
                        Category Name
                      </label>
                      <input
                        type="text"
                        name="newCategoryName"
                        value={newCategoryName}
                        onChange={(e) => setNewCategoryName(e.target.value)}
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
                        value={selectedCategory.id}
                        readOnly
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      />
                    </div>
                    <div className="mb-4">
                      <label className="block text-gray-700 text-sm font-bold mb-2">
                        Name
                      </label>
                      <input
                        type="text"
                        name="categoryName"
                        value={selectedCategory.categoryName}
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
                        value={selectedCategory.status}
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

export default AdminCategory;
