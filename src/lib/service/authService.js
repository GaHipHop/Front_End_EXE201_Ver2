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

const forgotPassword = async (email) => {
  return await axios.post(`Authentication/forgot-password`, { Email: email }, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

const verifyOtp = async (email, otp, token) => {
  return await axios.post(`Authentication/verify-otp`, {
    email: email,
    otp: otp,
    token: token,
  }, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

const resetPassword = async (email, newPassword) => {
  return await axios.post(`Authentication/reset-password`, {
    email: email,
    newPassword: newPassword,
  }, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
};



export { checkEmail, forgotPassword, postLogin, resetPassword, verifyOtp };

