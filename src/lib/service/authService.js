import axios from "../axiosCustomize";
const postLogin = async (data) => {
  return await axios.post(`Authentication/login`, data);
};
export { postLogin };

