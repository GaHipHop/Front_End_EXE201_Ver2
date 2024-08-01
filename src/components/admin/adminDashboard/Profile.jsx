import { Dialog, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material";
import { Button } from "@nextui-org/react";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getAdminById, updateAdmin } from "../../../lib/service/adminService";
import { forgotPassword, resetPassword, verifyOtp } from "../../../lib/service/authService";
import AdminHeader from "../adminLayout/AdminHeader";
import Sidebar from "../adminLayout/Sidebar";

function Profile() {
  const [userDetails, setUserDetails] = useState({
    id: "",
    userName: "",
    fullName: "",
    email: "",
    phone: "",
    address: "",
    password: "",
  });
  const [initialDetails, setInitialDetails] = useState({});
  const [errors, setErrors] = useState({});
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState("");
  const [openOtpDialog, setOpenOtpDialog] = useState(false); 
  const [openResetPasswordDialog, setOpenResetPasswordDialog] = useState(false);
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [countdown, setCountdown] = useState(60);
  const navigate = useNavigate();

  useEffect(() => {
    let timer;
    if (openOtpDialog) {
      setCountdown(60); // Reset countdown to 60 seconds whenever the OTP dialog is opened
      timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev > 0) {
            return prev - 1;
          } else {
            clearInterval(timer);
            return 0;
          }
        });
      }, 1000);
    } else {
      setCountdown(60); // Reset countdown when OTP dialog is closed
    }

    return () => clearInterval(timer);
  }, [openOtpDialog]);

  const handleForgotPassword = () => {
    if (!userDetails.email) {
      toast.error("Email not available for this user.");
      return;
    }

    setForgotPasswordEmail(userDetails.email);

    forgotPassword(userDetails.email)
      .then((response) => {
        if (response && response.data && response.data.data) {
          const tokenForgot = response.data.data.token;
          localStorage.setItem("tokenForgot", tokenForgot);
          toast.success("Please check your email for OTP.");
          setOpenOtpDialog(true);
        } else {
          throw new Error("Unexpected response structure.");
        }
      })
      .catch((error) => {
        toast.error("Failed to send OTP email.");
        console.error("Forgot Password Error:", error);
      });
  };

  const handleOtpSubmit = () => {
    const tokenForgot = localStorage.getItem("tokenForgot");
    verifyOtp(forgotPasswordEmail, otp, tokenForgot)
      .then(() => {
        toast.success("OTP Verified. You can now reset your password.");
        setOpenOtpDialog(false);
        setOpenResetPasswordDialog(true);
      })
      .catch((error) => {
        toast.error("OTP verification failed.");
        console.error("OTP Verification Error:", error);
      });
  };

  const handleResetPasswordSubmit = () => {
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match. Please try again.");
      return;
    }
  
    resetPassword(forgotPasswordEmail, newPassword)
      .then(() => {
        toast.success("Password reset successfully.");
        setOpenResetPasswordDialog(false);
      })
      .catch((error) => {
        toast.error("Password reset failed.");
        console.error("Password Reset Error:", error);
      });
  };

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        const u = userInfo.id;
        const token = localStorage.getItem('token');
        const response = await getAdminById(u, token);
        const userData = response.data.data;

        setUserDetails({
          id: userData.id,
          userName: userData.userName,
          fullName: userData.fullName,
          email: userData.email,
          phone: userData.phone,
          address: userData.address,
        });
        setInitialDetails({
          id: userData.id,
          userName: userData.userName,
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
    fetchUserDetails();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserDetails((prevState) => ({
      ...prevState,
      [name]: value !== "" ? value : prevState[name]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const phoneRegex = /^(0|\+84)[3|5|7|8|9][0-9]{8}$/;
    
    if (!phoneRegex.test(userDetails.phone)) {
      toast.error("Số điện thoại không hợp lệ. Vui lòng nhập số điện thoại hợp lệ theo định dạng Việt Nam.");
      return;
    }
    try {
      const token = localStorage.getItem('token');
      const userData = {
        UserName: userDetails.userName || initialDetails.userName,
        FullName: userDetails.fullName || initialDetails.fullName,
        Email: userDetails.email || initialDetails.email,
        Phone: userDetails.phone || initialDetails.phone,
        Address: userDetails.address || initialDetails.address,
        Password: userDetails.password || initialDetails.password,
      };

      console.log(initialDetails)
      await updateAdmin(userDetails.id, userData, token);

      toast.success("Profile updated successfully");
      // setTimeout(() => {
      //   navigate('/dashboard');
      // }, 5000);
    } catch (error) {
      if (error.response && error.response.status === 401) {
        toast.error("Truy cập không được phép. Vui lòng đăng nhập lại.");
        navigate('/login');
      } else if (error.response && error.response.data && error.response.data.errors) {
        setErrors(error.response.data.errors);
        Object.keys(error.response.data.errors).forEach((key) => {
          toast.error(`${key}: ${error.response.data.errors[key].join(', ')}`);
        });
      } else {
        toast.error(error.message);
      }
      console.error("Lỗi khi cập nhật hồ sơ:", error.message);
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
                      <label htmlFor="userName" className="w-1/4 text-left">Username</label>
                      <input
                        id="userName"
                        name="userName"
                        type="text"
                        className="w-3/4 p-2 border rounded"
                        placeholder="Username"
                        value={userDetails.userName}
                        disabled
                      />
                    </div>
                  </div>
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
                  <div className="flex justify-between w-full py-2.5 bg-white">
                    <Button type="submit" className="text-white bg-pink-400 border-2 border-solid border-white rounded-2xl">Update</Button>
                    <Button onClick={handleForgotPassword} className="text-white bg-blue-400 border-2 border-solid border-white rounded-2xl ml-4">Change Password</Button>
                  </div>
                </form>
              </div>
            </section>
          </div>
          <Dialog open={openOtpDialog} onClose={() => setOpenOtpDialog(false)}>
        <DialogTitle>Enter OTP</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="otp"
            label="OTP"
            type="text"
            fullWidth
            variant="standard"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />
          <p>{countdown > 0 ? `Time remaining: ${countdown}s` : "OTP has expired."}</p>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenOtpDialog(false)}>Cancel</Button>
          <Button onClick={handleOtpSubmit} disabled={countdown === 0}>
            Submit
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openResetPasswordDialog} onClose={() => setOpenResetPasswordDialog(false)}>
        <DialogTitle>Reset Password</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="new-password"
            label="New Password"
            type="password"
            fullWidth
            variant="standard"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <TextField
            margin="dense"
            id="confirm-password"
            label="Confirm New Password"
            type="password"
            fullWidth
            variant="standard"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenResetPasswordDialog(false)}>Cancel</Button>
          <Button onClick={handleResetPasswordSubmit}>Submit</Button>
        </DialogActions>
      </Dialog>
        </section>
      </main>
    </div>
  );
}

export default Profile;
