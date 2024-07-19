import axios from "../axiosCustomize";
const getAllKind = async () => {
  return await axios.get(`Kind/GetAllKind`);
};

const getAllKindFalse = async () => {
  return await axios.get(`Kind/GetAllKindFalse`);
};

const GetAllKindByProductId = async (id) => {
  return await axios.get(`Kind/GetAllKindByProductId/${id}`);
};

const GetKindById = async (id) => {
  return await axios.get(`Kind/GetKindById/${id}`);
};

const postcreateKind = async (data, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'multipart/form-data',
    },
  };
  try {
    const response = await axios.post(`Kind/CreateKind`, data, config);
    return response;
  } catch (error) {
    console.error("Error creating kind:", error.response ? error.response.data : error.message);
    throw error;
  }
};

const updateKind = async (id, data, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'multipart/form-data',
    },
  };
  try {
    const response = await axios.patch(`Kind/UpdateKind/${id}`, data, config);
    return response;
  } catch (error) {
    console.error("Error creating kind:", error.response ? error.response.data : error.message);
    throw error;
  }
};

const deleteKind = async (id) => {
  return await axios.delete(`Kind/DeleteKind/${id}`);
};

export {
  GetAllKindByProductId,
  GetKindById, deleteKind, getAllKind,
  getAllKindFalse, postcreateKind,
  updateKind
};

