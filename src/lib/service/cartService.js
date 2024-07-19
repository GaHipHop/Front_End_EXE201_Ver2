import axios from "../axiosCustomize";
const postCart = async (data) => {
  return await axios.post(`cart/add`, data);
};

const deleteCartbyid = async (id) => {
  return await axios.delete(`cart/remove/${id}`);
};

const updateCart = async (data) => {
  return await axios.put(`cart/update`, data);
};

const deleteCartClear = async () => {
  return await axios.delete(`cart/clear`);
};

const getCartItem = async () => {
  return await axios.get(`cart/items`);
};

export { deleteCartClear, deleteCartbyid, getCartItem, postCart, updateCart };

