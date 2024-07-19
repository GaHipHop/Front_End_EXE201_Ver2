import axios from "../axiosCustomize";
const getAllCategory = async () => {
  return await axios.get(`Category/GetAllCategory`);
};

const getAllCategoryFalse = async (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  return await axios.get(`Category/GetAllCategoryFalse`, config);
};

const GetCategoryById = async (id) => {
  return await axios.get(`Category/GetCategoryById/${id}`);
};

const postcreateCategory = async (data, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'multipart/form-data',
    },
  };

  const formData = new FormData();
  formData.append('CategoryName', data.categoryName);

  return await axios.post(`Category/CreateCategory`, formData, config);
};

const updateCategory = async (id, data, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'multipart/form-data',
    },
  };

  const formData = new FormData();
  formData.append('id', id);
  formData.append('CategoryName', data.categoryName);

  return await axios.patch(`Category/UpdateCategory/${id}`, formData, config);
};

const deleteCategory = async (id, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  return await axios.delete(`Category/DeleteCategory/${id}`, config);
};

export {
  GetCategoryById,
  deleteCategory,
  getAllCategory,
  getAllCategoryFalse,
  postcreateCategory,
  updateCategory
};

