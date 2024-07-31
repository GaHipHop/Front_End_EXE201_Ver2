import axios from "../axiosCustomize";
const getAllProduct = async () => {
  return await axios.get(`Product/GetAllProduct`);
};

const getAllProductByStatusFalse = async (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  return await axios.get(`Product/GetAllProductFalse`, config);
};

const getAllProductByCategoryId = async (id) => {
  return await axios.get(`Product/GetAllProductByCategoryId/${id}`);
};

const GetProductById = async (id) => {
  return await axios.get(`Product/GetProductById/${id}`);
};

const postcreateProduct = async (data, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'multipart/form-data',
    },
  };
  try {
    const response = await axios.post(`Product/CreateProduct`, data, config);
    return response;
  } catch (error) {
    console.error("Error creating product:", error.response.data);
    throw error;
  }
};

const updateProduct = async (id, data, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json', // Set the content type to JSON
    },
  };
  try {
    const response = await axios.patch(`Product/UpdateProduct/${id}`, data, config);
    return response;
  } catch (error) {
    console.error("Error updating product:", error.response ? error.response.data : error.message);
    throw error;
  }
};


const deletetProduct = async (id, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  return await axios.delete(`Product/DeleteProduct/${id}`, config);
};

const availableProduct = async (id, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  return await axios.delete(`Product/AvailableProduct/${id}`, config);
};

export {
  GetProductById, availableProduct, deletetProduct, getAllProduct, getAllProductByCategoryId, getAllProductByStatusFalse, postcreateProduct,
  updateProduct
};

