import { Button } from "@nextui-org/react";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getAdminById, updateAdmin } from "../../../lib/service/adminService"; // You need to implement these functions
import AdminHeader from "../adminLayout/AdminHeader";
import Sidebar from "../adminLayout/Sidebar";

function Profile() {
  const [userDetails, setUserDetails] = useState({
    id: "",
    fullName: "",
    email: "",
    phone: "",
    address: "",
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        const u = userInfo.id;
        console.log(u);
        const token = localStorage.getItem('token');
        const response = await getAdminById(u, token);
        console.log(response);
        const userData = response.data.data;
        console.log(userData);
        setUserDetails({
          id: userData.id,
          fullName: userData.fullName,
          email: userData.email,
          phone: userData.phone,
          address: userData.address,
        });
      } catch (error) {
        toast.error("Error fetching user details");
        console.log(error.message);
      }
    };
    //console.log(userDetails)
    fetchUserDetails();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserDetails({
      ...userDetails,
      [name]: value
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUserDetails({
        ...userDetails,
        avatar: file
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const userData = new FormData();
      userData.append("FullName", userDetails.fullName);
      userData.append("Phone", userDetails.phone);
      userData.append("Address", userDetails.address);
      if (userDetails.avatar) {
        userData.append("Avatar", userDetails.avatar);
      }

      if (!userDetails.id) {
        throw new Error("User ID is missing");
      }

      // Update User
      await updateAdmin(userDetails.id, userData, { headers: { Authorization: `Bearer ${token}` } });

      toast.success("Profile updated successfully");
      setTimeout(() => {
        navigate('/dashboard');
      }, 5000);
    } catch (error) {
      if (error.response && error.response.status === 401) {
        toast.error("Unauthorized access. Please log in again.");
        navigate('/login');
      } else if (error.response && error.response.data && error.response.data.errors) {
        setErrors(error.response.data.errors);
        Object.keys(error.response.data.errors).forEach((key) => {
          toast.error(`${key}: ${error.response.data.errors[key].join(', ')}`);
        });
      } else {
        toast.error("Error updating profile");
      }
      console.error("Error updating profile:", error);
    }
  };

  return (
    <div className="h-screen bg-white flex">
      <Sidebar />
      <main className="flex flex-col w-full overflow-auto">
        <header className="admin-header">
          <AdminHeader title="Edit Profile" />
        </header>
        <ToastContainer />
        <section className="flex flex-col px-6 pt-6 mt-4 bg-white border-t border-solid border-black border-opacity-30 max-md:pr-5 max-md:max-w-full">
          <div className="mx-4 max-md:mr-2.5 max-md:max-w-full">
            <section className="flex flex-col items-start text-base font-medium tracking-tight text-center text-black max-md:flex-wrap max-md:pr-5">
              <div className="flex flex-col justify-between w-full px-2.5 py-2.5 bg-white">
                <h2 className="text-left text-pink-500 mb-4">Edit Profile</h2>
                <form onSubmit={handleSubmit}>
                  <div className="flex flex-col px-2.5 py-2.5 bg-white">
                    <div className="flex items-center mb-2">
                      <label htmlFor="fullName" className="w-1/4 text-left">Full Name</label>
                      <input
                        id="fullName"
                        name="fullName"
                        type="text"
                        className="w-3/4 p-2 border rounded"
                        placeholder="Full Name"
                        value={userDetails.fullName}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                  <div className="flex flex-col px-2.5 py-2.5 bg-white">
                    <div className="flex items-center mb-2">
                      <label htmlFor="email" className="w-1/4 text-left">Email</label>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        className="w-3/4 p-2 border rounded"
                        placeholder="Email"
                        value={userDetails.email}
                        onChange={handleInputChange}
                        disabled
                      />
                    </div>
                  </div>
                  <div className="flex flex-col px-2.5 py-2.5 bg-white">
                    <div className="flex items-center mb-2">
                      <label htmlFor="phone" className="w-1/4 text-left">Phone</label>
                      <input
                        id="phone"
                        name="phone"
                        type="text"
                        className="w-3/4 p-2 border rounded"
                        placeholder="Phone"
                        value={userDetails.phone}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                  <div className="flex flex-col px-2.5 py-2.5 bg-white">
                    <div className="flex items-center mb-2">
                      <label htmlFor="address" className="w-1/4 text-left">Address</label>
                      <input
                        id="address"
                        name="address"
                        type="text"
                        className="w-3/4 p-2 border rounded"
                        placeholder="Address"
                        value={userDetails.address}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                  <div className="flex justify-center w-full py-2.5 bg-white">
                    <Button type="submit" className="text-white bg-pink-400 border-2 border-solid border-white rounded-2xl">Update</Button>
                  </div>
                </form>
              </div>
            </section>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Profile;
