import { faLock, faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Checkbox } from "@nextui-org/react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { postLogin } from "../../lib/service/authService";

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    isRemember: false,
  });

  const [loading, setLoading] = useState(false);

  // Placeholder function for login handling
  const login = (userInfo) => {
    // Simulated login function, replace with actual implementation
    console.log("User logged in:", userInfo);
  };

  const handleDataChange = (key, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [key]: value,
    }));
  };

  const handleLogin = async () => {
    setLoading(true);

    try {
      const response = await postLogin(formData);
      const { token, loginResponse } = response.data.data;

      const userInfo = {
        id: loginResponse.id,
        username: loginResponse.userName,
        fullName: loginResponse.fullName,
        roleId: loginResponse.roleId,
        email: loginResponse.email,
        token: token,
      };

      localStorage.setItem("token", token);
      localStorage.setItem("userInfo", JSON.stringify(userInfo));

      login(userInfo); // Call the login function with userInfo
      toast.success("Login Successful");

      setTimeout(() => {
        if (loginResponse.roleId === 1) {
          navigate("/admin/Dashboard");
        } else {
          navigate("/");
        }
      }, 1000);
    } catch (error) {
      setLoading(false);
      toast.error("Login Failed. Please check your credentials.");
      console.error("Login Error:", error); // Log the error for debugging
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="flex overflow-hidden relative flex-col justify-center items-center px-16 py-20 min-h-screen max-md:px-5">
      <img
        loading="lazy"
        src="/src/assets/image/loginBG.png"
        alt=""
        className="object-cover absolute inset-0 w-full h-full"
        style={{ zIndex: -1 }}
      />
      <div className="relative z-10 flex flex-col md:flex-row items-center justify-center w-full max-w-2xl bg-pink-100 bg-opacity-80 p-8 rounded-lg shadow-lg">
        <div className="flex flex-col items-center justify-center w-full md:w-1/2 p-4">
          <img
            src="/src/assets/image/logo.png"
            alt="Ga Hiphop Logo"
            className="w-40 h-40 mb-10"
          />
          <h1 className="text-5xl font-poiret-one font-medium">Ga Hiphop</h1>
        </div>
        <div className="h-1 w-full md:h-full md:w-1 bg-black my-4 md:my-0"></div>
        <div className="flex flex-col items-center justify-center w-full md:w-1/2 p-4">
          <h2 className="text-2xl font-plus-jakarta font-semibold mb-4">
            Login Here
          </h2>
          <div className="relative w-full max-w-sm mb-5">
            <FontAwesomeIcon
              icon={faUser}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500"
            />
            <input
              type="text"
              placeholder="Username"
              onChange={(e) => handleDataChange("username", e.target.value)}
              className="pl-10 p-2 border rounded-full w-full shadow"
            />
          </div>
          <div className="relative w-full max-w-sm mb-5">
            <FontAwesomeIcon
              icon={faLock}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500"
            />
            <input
              type="password"
              placeholder="Password"
              onChange={(e) => handleDataChange("password", e.target.value)}
              className="pl-10 p-2 border rounded-full w-full shadow"
            />
          </div>
          <div className="relative w-full max-w-sm mb-4 ml-8 flex items-center">
            <Checkbox
              id="rememberMe"
              defaultChecked={formData.isRemember}
              onChange={(e) =>
                handleDataChange("isRemember", e.target.checked)
              }
              className="mr-1"
            />
            <label htmlFor="rememberMe" className="text-gray-700 mb-1">
              Remember Me
            </label>
          </div>
          <Button
            className="bg-gradient-to-r from-pink-500 to-purple-500 text-white py-2 px-8 rounded-full shadow transition duration-300 ease-in-out transform hover:scale-105"
            onClick={handleLogin}
          >
            {loading ? "Logging in..." : "Login"}
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Login;
