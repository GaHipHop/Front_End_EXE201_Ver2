import axios from "../axiosCustomize";
const getAllContacts = async () => {
  return await axios.get(`Contact/getAllContacts`);
};

const getContactBy = async (id) => {
  return await axios.get(`Contact/GetContactBy/${id}`);
};

const postcreateContact = async (data) => {
  return await axios.post(`Contact/CreateContact/`, data);
};

const updateContact = async (id, data, token) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    console.log(`Sending request to update contact with ID: ${id}`);
    console.log('Data:', data);
    console.log('Config:', config);
    const response = await axios.patch(`Contact/UpdateContact/${id}`, data, config);
    return response.data;
  } catch (error) {
    console.error("Error updating contact:", error);
    if (error.response) {
      console.error('Response data:', error.response.data);
      console.error('Response status:', error.response.status);
      console.error('Response headers:', error.response.headers);
    } else if (error.request) {
      console.error('Request data:', error.request);
    } else {
      console.error('Error message:', error.message);
    }
    throw error;
  }
};

const deleteContact = async (id) => {
  return await axios.delete(`Contact/DeleteContact/${id}`);
};

export {
  deleteContact,
  getAllContacts,
  getContactBy,
  postcreateContact,
  updateContact
};

