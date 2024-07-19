import axios from "../axiosCustomize";
const getAllAdminByStatusTrue = async (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  return await axios.get(`Admin/getAllAdminByStatusTrue`, config);
};

const getAllAdminByStatusFalse = async (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  return await axios.get(`Admin/getAllAdminByStatusFalse`, config);
};

const getAdminById = async (id, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  return await axios.get(`Admin/getAdminById/${id}`, config);
};

const postcreateAdmin = async (data, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  return await axios.post(`Admin/createAdmin`, data, config);
};

const updateAdmin = async (id, data, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  return await axios.patch(`Admin/updateAdmin/${id}`, data, config);
};

const deletetAdmin = async (id, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  return await axios.delete(`Admin/deletetAdmin/${id}`, config);
};

export { deletetAdmin, getAdminById, getAllAdminByStatusFalse, getAllAdminByStatusTrue, postcreateAdmin, updateAdmin };

