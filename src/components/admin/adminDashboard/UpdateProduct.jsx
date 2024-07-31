import { Button } from "@nextui-org/react";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getAllCategory } from "../../../lib/service/categoryService";
import { getAllDiscount } from "../../../lib/service/discountService";
import { deleteKind, postcreateKind, updateKind } from "../../../lib/service/kindService";
import { GetProductById, updateProduct } from "../../../lib/service/productService";
import AdminHeader from "../adminLayout/AdminHeader";
import Sidebar from "../adminLayout/Sidebar";

function UpdateProduct() {
  const location = useLocation();
  const { product } = location.state || {};
  const [categories, setCategories] = useState([]);
  const [discounts, setDiscounts] = useState([]);
  const [updatedProduct, setUpdatedProduct] = useState({
    id: product?.id || "",
    productName: product?.productName || "",
    categoryId: product?.categoryId || "",
    discountId: product?.discountId || "",
    productPrice: product?.productPrice || "",
    productDescription: product?.productDescription || ""
  });
  const [kinds, setKinds] = useState(product?.kinds || [
    { id: null, colorName: "", quantity: "", file: null }
  ]);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    if (product && product.id) {
      const fetchProductDetails = async () => {
        try {
          const token = localStorage.getItem('token');
          const response = await GetProductById(product.id, { headers: { Authorization: `Bearer ${token}` } });
          const productData = response.data.data;
          setUpdatedProduct({
            id: productData.id,
            productName: productData.productName,
            categoryId: productData.categoryId,
            discountId: productData.discountId,
            productPrice: productData.productPrice,
            productDescription: productData.productDescription
          });
          setKinds(productData.kinds || []);
        } catch (error) {
          toast.error("Error fetching product details");
        }
      };
      fetchProductDetails();
    }
  }, [product]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getAllCategory();
        const categories = response.data?.data ?? [];
        setCategories(categories);
      } catch (error) {
        toast.error("Error fetching categories");
        setCategories([]);
      }
    };

    const fetchDiscounts = async () => {
      try {
        const response = await getAllDiscount();
        const discounts = response.data.data ?? [];
        setDiscounts(discounts);
      } catch (error) {
        toast.error("Error fetching discounts");
        setDiscounts([]);
      }
    };

    fetchCategories();
    fetchDiscounts();
  }, []);

  const handleProductChange = (e) => {
    const { name, value } = e.target;
    setUpdatedProduct({
      ...updatedProduct,
      [name]: value
    });
  };

  const handleKindChange = (index, e) => {
    const { name, value, files } = e.target;
    const updatedKinds = kinds.map((kind, i) => 
      i === index ? { ...kind, [name]: files ? files[0] : value } : kind
    );
    setKinds(updatedKinds);
  };

  const addKind = () => {
    setKinds([...kinds, { id: null, colorName: "", quantity: "", file: null }]);
  };

  const removeKind = async (index) => {
    if (window.confirm("Are you sure you want to delete this kind?")) {
      const kind = kinds[index];
      if (kind.id) {
        try {
          const token = localStorage.getItem('token');
          await deleteKind(kind.id, token);
          toast.success("Kind deleted successfully");
        } catch (error) {
          toast.error("Error deleting kind");
          console.error("Error deleting kind:", error);
        }
      }
      setKinds(kinds.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const productData = new FormData();
      productData.append("ProductName", updatedProduct.productName);
      productData.append("CategoryId", updatedProduct.categoryId);
      productData.append("DiscountId", updatedProduct.discountId);
      productData.append("ProductPrice", updatedProduct.productPrice);
      productData.append("ProductDescription", updatedProduct.productDescription);

      if (!updatedProduct.id) {
        throw new Error("Product ID is missing");
      }

      // Update Product
      await updateProduct(updatedProduct.id, productData, token);

      // Handle Kinds
      for (let kind of kinds) {
        const kindData = new FormData();
        kindData.append("ProductId", updatedProduct.id);
        kindData.append("ColorName", kind.colorName);
        kindData.append("Quantity", kind.quantity);
        if (kind.file) {
          kindData.append("File", kind.file);
        }

        if (kind.id) {
          await updateKind(kind.id, kindData, token);
        } else {
          await postcreateKind(kindData, token);
        }
      }

      toast.success("Product and kinds updated successfully");

      setTimeout(() => {
        navigate('/admin/manageProducts');
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
        toast.error("Error updating product or kinds");
      }
      console.error("Error updating product or kinds:", error);
    }
  };

  return (
    <div className="h-screen bg-white flex">
      <Sidebar />
      <main className="flex flex-col w-full overflow-auto">
        <header className="admin-header">
          <AdminHeader title="Update Product" />
        </header>
        <ToastContainer />
        <section className="flex flex-col px-6 pt-6 mt-4 bg-white border-t border-solid border-black border-opacity-30 max-md:pr-5 max-md:max-w-full">
          <div className="mx-4 max-md:mr-2.5 max-md:max-w-full">
            <section className="flex flex-col items-start text-base font-medium tracking-tight text-center text-black max-md:flex-wrap max-md:pr-5">
              <div className="flex flex-col justify-between w-full px-2.5 py-2.5 bg-white">
                <h2 className="text-left text-pink-500 mb-4">Update Product</h2>
                <form onSubmit={handleSubmit}>
                  <div className="flex flex-col px-2.5 py-2.5 bg-white">
                    <div className="flex items-center mb-2">
                      <label htmlFor="productName" className="w-1/4 text-left">Name</label>
                      <input
                        id="productName"
                        name="productName"
                        type="text"
                        className="w-3/4 p-2 border rounded"
                        placeholder="Name"
                        value={updatedProduct.productName}
                        onChange={handleProductChange}
                      />
                    </div>
                  </div>
                  <div className="flex flex-col px-2.5 py-2.5 bg-white">
                    <div className="flex items-center mb-2">
                      <label htmlFor="categoryId" className="w-1/4 text-left">Category</label>
                      <select
                        id="categoryId"
                        name="categoryId"
                        className="w-3/4 p-2 border rounded"
                        value={updatedProduct.categoryId}
                        onChange={handleProductChange}
                      >
                        {categories.map(category => (
                          <option key={category.id} value={category.id}>{category.categoryName}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="flex flex-col px-2.5 py-2.5 bg-white">
                    <div className="flex items-center mb-2">
                      <label htmlFor="discountId" className="w-1/4 text-left">Discount</label>
                      <select
                        id="discountId"
                        name="discountId"
                        className="w-3/4 p-2 border rounded"
                        value={updatedProduct.discountId}
                        onChange={handleProductChange}
                      >
                        {discounts.map(discount => (
                          <option key={discount.id} value={discount.id}>{`Discount ${discount.percent}% - Expires on ${discount.expiredDate}`}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="flex flex-col px-2.5 py-2.5 bg-white">
                    <div className="flex items-center mb-2">
                      <label htmlFor="productPrice" className="w-1/4 text-left">Price</label>
                      <input
                        id="productPrice"
                        name="productPrice"
                        type="text"
                        className="w-3/4 p-2 border rounded"
                        placeholder="1,2,3,..."
                        value={updatedProduct.productPrice}
                        onChange={handleProductChange}
                      />
                    </div>
                    {errors.ProductPrice && <p className="text-red-500">{errors.ProductPrice}</p>}
                  </div>
                  <div className="flex flex-col px-2.5 py-2.5 bg-white">
                    <div className="flex items-center mb-2">
                      <label htmlFor="productDescription" className="w-1/4 text-left">Description</label>
                      <textarea
                        id="productDescription"
                        name="productDescription"
                        className="w-3/4 p-2 border rounded"
                        placeholder="1,2,3,..."
                        value={updatedProduct.productDescription}
                        onChange={handleProductChange}
                      ></textarea>
                    </div>
                  </div>
                  <h2 className="text-left text-pink-500 mb-4">Add Kinds</h2>
                  {kinds.map((kind, index) => (
                    <div key={index} className="flex flex-col px-2.5 py-2.5 bg-white">
                      <div className="flex items-center mb-2">
                        <label htmlFor={`colorName-${index}`} className="w-1/4 text-left">Color Name</label>
                        <input
                          id={`colorName-${index}`}
                          name="colorName"
                          type="text"
                          className="w-3/4 p-2 border rounded"
                          value={kind.colorName}
                          onChange={(e) => handleKindChange(index, e)}
                        />
                      </div>
                      <div className="flex items-center mb-2">
                        <label htmlFor={`quantity-${index}`} className="w-1/4 text-left">Quantity</label>
                        <input
                          id={`quantity-${index}`}
                          name="quantity"
                          type="text"
                          className="w-3/4 p-2 border rounded"
                          placeholder="1,2,3,..."
                          value={kind.quantity}
                          onChange={(e) => handleKindChange(index, e)}
                        />
                      </div>
                      <div className="flex items-center mb-2">
                        <label htmlFor={`file-${index}`} className="w-1/4 text-left">File</label>
                        <div className="w-3/4 flex items-center">
                          <img
                            src={kind.image}
                            alt=""
                            className="w-24 h-24 object-cover mr-2"
                          />
                          <input
                            id={`file-${index}`}
                            name="file"
                            type="file"
                            className="flex-1 p-2 border rounded"
                            onChange={(e) => handleKindChange(index, e)}
                          />
                        </div>
                      </div>
                      <div className="flex justify-between w-full mt-2">
                        <Button onClick={() => removeKind(index)} className="bg-red-600 text-white" size="sm">Remove</Button>
                        <Button onClick={addKind} className="bg-green-600 text-white" size="sm">Add Kind</Button>
                      </div>
                    </div>
                  ))}
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

export default UpdateProduct;
