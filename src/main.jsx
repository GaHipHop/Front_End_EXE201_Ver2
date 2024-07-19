import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import AdminCategory from "./components/admin/adminDashboard/AdminCategory";
import AdminDiscount from "./components/admin/adminDashboard/AdminDiscount";
import AdminManage from "./components/admin/adminDashboard/AdminManage";
import Contact from "./components/admin/adminDashboard/Contact";
import Dashboard from "./components/admin/adminDashboard/Dashboard";
import ProductList from "./components/admin/adminDashboard/ProductList";
import Transaction from "./components/admin/adminDashboard/Transaction";
import UpdateProduct from "./components/admin/adminDashboard/UpdateProduct";
import About from "./components/pages/About";
import Home from "./components/pages/Home";
// import AdminProduct from "./components/admin/adminDashboard/AdminProduct"
// import AdminCategory from "./components/admin/adminDashboard/AdminCategory"
import Layout from "./components/layout/Layout";
import Checkout from "./components/pages/Checkout";
import Login from "./components/pages/Login";
import { NotFound } from "./components/pages/NotFound/NotFound";
import Product from "./components/pages/Product";
import ProductDetail from "./components/pages/ProductDetail";
import SuccessPage from "./components/pages/SuccessPage";
import "./index.css";
import AdminProduct from "./components/admin/adminDashboard/AdminProduct";
import PaymentSuccess from "./components/pages/PaymentStatus/PaymentSuccess";
import PaymentFail from "./components/pages/PaymentStatus/PaymentFail";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        {/* Layout cho trang thường */}
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="home" element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="login" element={<Login />} />
          <Route path="product" element={<Product />} />
          <Route path="productDetail/:productId" element={<ProductDetail />} />
          <Route path="checkout" element={<Checkout />} />
          <Route path="success" element={<SuccessPage />} />
          <Route path="payment-success" element={<PaymentSuccess />} />
          <Route path="payment-fail" element={<PaymentFail />} />
          <Route path="*" element={<NotFound />} />
          <Route path="fail" element={<NotFound />} />
        </Route>

        <Route path="admin/dashboard" element={<Dashboard />} />
        <Route path="admin/transaction" element={<Transaction />} />

        {/* <Route path="/admin/products" element={<AdminProduct />} /> */}
        <Route path="/admin/manageProducts" element={<ProductList />} />
        <Route path="/admin/createProducts" element={<AdminProduct />} />
        <Route path="/admin/updateProducts" element={<UpdateProduct />} />
        <Route path="/admin/category" element={<AdminCategory />} />
        <Route path="/admin/discount" element={<AdminDiscount />} />
        <Route path="/admin/manageAdmin" element={<AdminManage />} />
        <Route path="/admin/contact" element={<Contact />} />
        {/* <Route path="/admin/categories" element={<AdminCategory />} /> */}
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
