import axios from "../axiosCustomize";
const getAllDiscount = async () => {
  return await axios.get(`Discount/GetAllDiscount`);
};

const getAllDiscountFalse = async (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  return await axios.get(`Discount/GetAllDiscountFalse`, config);
};

const GetDiscountBy = async (id, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  return await axios.get(`Discount/GetDiscountBy/${id}`, config);
};

const postcreateDiscount = async (data, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  return await axios.post(`Discount/CreateDiscount`, data, config);
};

const updateDiscount = async (id, data, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  return await axios.patch(`Discount/UpdateDiscount/${id}`, data, config);
};

const deletetDiscount = async (id, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  return await axios.delete(`Discount/DeleteDiscount/${id}`, config);
};

export {
  GetDiscountBy, deletetDiscount, getAllDiscount, getAllDiscountFalse, postcreateDiscount,
  updateDiscount
};

