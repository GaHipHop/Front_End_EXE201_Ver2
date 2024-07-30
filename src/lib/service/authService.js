import axios from "../axiosCustomize";
const postLogin = async (data) => {
  return await axios.post(`Authentication/login`, data);
};

const checkEmail = async (email) => {
  const data = { email };
  try {
    const response = await axios.post('Authentication/login-google', data, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Check Email Error:', error.response ? error.response.data : error.message);
    throw error;
  }
};

export { checkEmail, postLogin };

