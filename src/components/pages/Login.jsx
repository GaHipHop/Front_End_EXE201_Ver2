import { faLock, faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import { Button } from "@nextui-org/react";
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  checkEmail,
  forgotPassword,
  postLogin,
  resetPassword,
  verifyOtp,
} from "../../lib/service/authService";
import ImgLoginURL from "src/assets/image/loginBG.png";
import ImgURL from "src/assets/image/1.image.png";

const clientId =
  "389880763269-br8hcrtulhe7kpg91mrkfejj2tfots04.apps.googleusercontent.com";

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [openForgotPassword, setOpenForgotPassword] = useState(false);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState("");
  const [openOtpDialog, setOpenOtpDialog] = useState(false);
  const [otp, setOtp] = useState("");
  const [openResetPasswordDialog, setOpenResetPasswordDialog] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [countdown, setCountdown] = useState(60);

  const login = (userInfo) => {
    console.log("User logged in:", userInfo);
  };

  const handleDataChange = (key, value) => {
    setFormData((prevData) => ({ ...prevData, [key]: value }));
  };

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
      login(userInfo);
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
      console.error("Login Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLoginSuccess = async (response) => {
    try {
      const ggtoken = response.credential;
      const decoded = jwtDecode(ggtoken);
      if (!decoded.email) {
        throw new Error("Email not found in Google token.");
      }
      const email = decoded.email;
      const emailExists = await checkEmail(email);
      if (emailExists) {
        const token = emailExists.data.token;
        const roleId = emailExists.data.loginResponse.roleId;
        const id = emailExists.data.loginResponse.id;
        const userInfo = {
          email,
          token,
          roleId,
          id,
        };
        localStorage.setItem("token", token);
        localStorage.setItem("userInfo", JSON.stringify(userInfo));
        login(userInfo);
        toast.success("Google Login Successful");
        setTimeout(() => {
          navigate("/admin/Dashboard");
        }, 1000);
      } else {
        toast.error(
          "Email not found in database. Please use another method to login."
        );
      }
    } catch (error) {
      toast.error("Google Login Failed. Please try again later.");
      console.error("Google Login Error:", error.message);
    }
  };

  const handleOpenForgotPassword = () => {
    setOpenForgotPassword(true);
  };

  const handleCloseForgotPassword = () => {
    setOpenForgotPassword(false);
  };

  const handleForgotPasswordSubmit = () => {
    forgotPassword(forgotPasswordEmail)
      .then((response) => {
        if (response && response.data && response.data.data) {
          const tokenForgot = response.data.data.token;
          localStorage.setItem("tokenForgot", tokenForgot);
          toast.success("Please check your email for OTP.");
          handleCloseForgotPassword();
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
    setOpenOtpDialog(false);
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

  return (
    <GoogleOAuthProvider clientId={clientId}>
      <style>
        {`
            .custom-input::placeholder {
              color: white;
            }
          `}
      </style>
      <section className="flex justify-start items-center overflow-hidden relative px-16 py-20 min-h-screen max-md:px-5">
        <img
          loading="lazy"
          src={ImgLoginURL}
          alt=""
          className="object-cover absolute inset-0 w-full h-full"
          style={{ zIndex: -1 }}
        />
        <div
          className="relative z-10 flex flex-col md:flex-row w-full max-w-2xl bg-opacity-80 p-8 rounded-lg shadow-lg"
          style={{ marginBottom: 55, marginLeft: 55 }}
        >
          <div className="h-1 w-full md:h-full md:w-1 bg-black my-4 md:my-0"></div>
          <div className="flex flex-col items-center justify-center w-full md:w-1/2 p-4">
            <h2
              className="w-full max-w-sm mt-4 flex justify-end text-4xl font-plus-jakarta font-semibold text-white"
              style={{ marginLeft: 303, marginBottom: 15 }}
            >
              Login Here
            </h2>

            <div className="relative w-full max-w-sm mb-5">
              <FontAwesomeIcon
                icon={faUser}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500"
              />
              <input
                type="text"
                placeholder="Enter your username"
                onChange={(e) => handleDataChange("username", e.target.value)}
                className="custom-input pl-10 p-2 rounded shadow bg-transparent"
                style={{
                  backgroundColor: "transparent",
                  color: "white",
                  width: 432,
                  height: 55,
                  border: "1px solid white",
                }}
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
                className="custom-input pl-10 p-2 rounded shadow bg-transparent"
                style={{
                  backgroundColor: "transparent",
                  color: "white",
                  width: 432,
                  height: 55,
                  border: "1px solid white",
                }}
              />
            </div>
            <div
              className="w-full max-w-sm mt-4 flex justify-end"
              style={{ marginTop: 0, marginBottom: 10, marginLeft: 304 }}
            >
              <a
                href="#"
                onClick={handleOpenForgotPassword}
                className="text-white hover:underline"
              >
                Forgot Password?
              </a>
            </div>

            <Button
              className="bg-[#EEA4F1] text-white text-2xl py-2 px-8 shadow transition duration-300 ease-in-out transform hover:scale-105"
              onClick={handleLogin}
              disabled={loading}
              style={{ width: 432, height: 55, marginLeft: 150 }}
            >
              {loading ? "Logging in..." : "Login"}
            </Button>
            <div
              className="relative flex items-center max-w-sm my-4"
              style={{ width: 618, marginLeft: 140 }}
            >
              <div className="flex-grow border-t border-gray-400"></div>
              <span className="flex-shrink mx-4 text-gray-400">Or</span>
              <div className="flex-grow border-t border-gray-400"></div>
            </div>
            <div className="w-full max-w-sm">
              <GoogleLogin
                onSuccess={handleGoogleLoginSuccess}
                onError={() => {
                  toast.error("Google Login Failed. Please try again.");
                }}
                useOneTap
                render={({ onClick }) => (
                  <button
                    className="w-full flex items-center justify-center py-2 px-4 border border-gray-300 rounded-full shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                    onClick={onClick}
                  >
                    Login with Google
                  </button>
                )}
              />
            </div>
          </div>
        </div>
      </section>

      <Dialog open={openForgotPassword} onClose={handleCloseForgotPassword}>
        <DialogTitle>Forgot Password</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="email"
            label="Email Address"
            type="email"
            fullWidth
            variant="standard"
            value={forgotPasswordEmail}
            onChange={(e) => setForgotPasswordEmail(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseForgotPassword}>Cancel</Button>
          <Button onClick={handleForgotPasswordSubmit}>Submit</Button>
        </DialogActions>
      </Dialog>

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
          <p>
            {countdown > 0
              ? `Time remaining: ${countdown}s`
              : "OTP has expired."}
          </p>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenOtpDialog(false)}>Cancel</Button>
          <Button onClick={handleOtpSubmit} disabled={countdown === 0}>
            Submit
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openResetPasswordDialog}
        onClose={() => setOpenResetPasswordDialog(false)}
      >
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
          <Button onClick={() => setOpenResetPasswordDialog(false)}>
            Cancel
          </Button>
          <Button onClick={handleResetPasswordSubmit}>Submit</Button>
        </DialogActions>
      </Dialog>
    </GoogleOAuthProvider>
  );
};

export default Login;
