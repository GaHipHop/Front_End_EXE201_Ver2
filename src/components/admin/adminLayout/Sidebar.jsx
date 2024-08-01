import {
  Category,
  ChevronLeft,
  ChevronRight,
  ContactSupport,
  Home,
  List,
  LocalOffer,
  Logout,
  ShoppingCart,
} from "@mui/icons-material";
import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";

const Sidebar = () => {
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userInfo");
    navigate("/login");
  };

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div
      className={`h-screen bg-gradient-to-b from-[#EDAFDB] to-[#A25FA5] flex flex-col items-center py-10 px-4 ${
        isCollapsed ? "w-20" : "w-80"
      } transition-all duration-300 relative`}
    >
      <div className="flex flex-col items-center">
        <img
          src="/src/assets/image/logo.png"
          alt="Logo"
          className={`w-20 h-20 mb-5 ${isCollapsed ? "rounded-full" : ""}`}
        />
        {!isCollapsed && (
          <h1 className="text-xl font-semibold text-gray-700 font-poiret-one">
            GaHipHop
          </h1>
        )}
      </div>
      <div className="flex flex-col mt-10 space-y-4 w-full">
        <NavLink
          to="/admin/dashboard"
          className={({ isActive }) =>
            `flex items-center py-3 rounded-xl font-medium font-plus-jakarta w-full text-left transition duration-300 ease-in-out ${
              isActive
                ? "bg-opacity-20 bg-black text-white"
                : "bg-[#EEA4F1] text-white hover:bg-opacity-20 hover:bg-black hover:text-white"
            } ${isCollapsed ? "justify-center" : "px-6"}`
          }
        >
          <Home />
          {!isCollapsed && <span className="ml-4">Home</span>}
        </NavLink>
        <NavLink
          to="/admin/transaction"
          className={({ isActive }) =>
            `flex items-center py-3 rounded-xl font-medium font-plus-jakarta w-full text-left transition duration-300 ease-in-out ${
              isActive
                ? "bg-opacity-20 bg-black text-white"
                : "bg-[#EEA4F1] text-white hover:bg-opacity-20 hover:bg-black hover:text-white"
            } ${isCollapsed ? "justify-center" : "px-6"}`
          }
        >
          <List />
          {!isCollapsed && <span className="ml-4">Transaction</span>}
        </NavLink>
        <NavLink
          to="/admin/manageProducts"
          className={({ isActive }) =>
            `flex items-center py-3 rounded-xl font-medium font-plus-jakarta w-full text-left transition duration-300 ease-in-out ${
              isActive
                ? "bg-opacity-20 bg-black text-white"
                : "bg-[#EEA4F1] text-white hover:bg-opacity-20 hover:bg-black hover:text-white"
            } ${isCollapsed ? "justify-center" : "px-6"}`
          }
        >
          <ShoppingCart />
          {!isCollapsed && <span className="ml-4">Products</span>}
        </NavLink>
        <NavLink
          to="/admin/category"
          className={({ isActive }) =>
            `flex items-center py-3 rounded-xl font-medium font-plus-jakarta w-full text-left transition duration-300 ease-in-out ${
              isActive
                ? "bg-opacity-20 bg-black text-white"
                : "bg-[#EEA4F1] text-white hover:bg-opacity-20 hover:bg-black hover:text-white"
            } ${isCollapsed ? "justify-center" : "px-6"}`
          }
        >
          <Category />
          {!isCollapsed && <span className="ml-4">Categories</span>}
        </NavLink>
        <NavLink
          to="/admin/discount"
          className={({ isActive }) =>
            `flex items-center py-3 rounded-xl font-medium font-plus-jakarta w-full text-left transition duration-300 ease-in-out ${
              isActive
                ? "bg-opacity-20 bg-black text-white"
                : "bg-[#EEA4F1] text-white hover:bg-opacity-20 hover:bg-black hover:text-white"
            } ${isCollapsed ? "justify-center" : "px-6"}`
          }
        >
          <LocalOffer />
          {!isCollapsed && <span className="ml-4">Discount</span>}
        </NavLink>
        {userInfo.roleId === 1 && (
          <>
            <NavLink
              to="/admin/contact"
              className={({ isActive }) =>
                `flex items-center py-3 rounded-xl font-medium font-plus-jakarta w-full text-left transition duration-300 ease-in-out ${
                  isActive
                    ? "bg-opacity-20 bg-black text-white"
                    : "bg-[#EEA4F1] text-white hover:bg-opacity-20 hover:bg-black hover:text-white"
                } ${isCollapsed ? "justify-center" : "px-6"}`
              }
            >
              <ContactSupport />
              {!isCollapsed && <span className="ml-4">Contact</span>}
            </NavLink>
          </>
        )}
      </div>
      <NavLink
        to="/login"
        className={({ isActive }) =>
          `flex items-center mt-auto py-3 rounded-xl font-medium font-plus-jakarta w-full text-left transition duration-300 ease-in-out ${
            isActive
              ? "bg-opacity-20 bg-black text-white"
              : "bg-[#EEA4F1] text-white hover:bg-opacity-20 hover:bg-black hover:text-white"
          } ${isCollapsed ? "justify-center" : "px-6"}`
        }
        onClick={handleLogout}
      >
        <Logout />
        {!isCollapsed && <span className="ml-4">Log out</span>}
      </NavLink>
      <button
        onClick={toggleCollapse}
        className="absolute top-10 -right-4 bg-white rounded-full shadow-lg p-2 transform transition-transform"
      >
        {isCollapsed ? <ChevronRight /> : <ChevronLeft />}
      </button>
    </div>
  );
};

export default Sidebar;
