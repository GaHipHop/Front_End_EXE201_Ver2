import { Button } from "@nextui-org/react";
import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getAllCategory } from "../../../lib/service/categoryService";
import { getAllDiscount } from "../../../lib/service/discountService";
import { postcreateKind } from "../../../lib/service/kindService";
import { postcreateProduct } from "../../../lib/service/productService";
import AdminHeader from "../adminLayout/AdminHeader";
import Sidebar from "../adminLayout/Sidebar";

function AddProductForm() {
  const [categories, setCategories] = useState([]);
  const [discounts, setDiscounts] = useState([]);
  const [product, setProduct] = useState({
    name: "",
    categoryId: "",
    discountId: "",
    price: "",
    description: ""
  });
  const [kinds, setKinds] = useState([{ colorName: "", quantity: "", file: null }]);
  const [errors, setErrors] = useState({});

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
    setProduct({
      ...product,
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
    setKinds([...kinds, { colorName: "", quantity: "", file: null }]);
  };

  const removeKind = (index) => {
    setKinds(kinds.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    const token = localStorage.getItem('token');
    e.preventDefault();
    try {
      const productData = new FormData();
      productData.append("ProductName", product.name);
      productData.append("CategoryId", product.categoryId);
      productData.append("DiscountId", product.discountId);
      productData.append("ProductPrice", product.price);
      productData.append("ProductDescription", product.description);

      // Create Product
      const productResponse = await postcreateProduct(productData, token);
      const productId = productResponse.data.data.id;

      // Create Kinds
      for (let kind of kinds) {
        const kindData = new FormData();
        kindData.append("ProductId", productId);
        kindData.append("ColorName", kind.colorName);
        kindData.append("Quantity", kind.quantity);
        if (kind.file) {
          kindData.append("File", kind.file);
        }
        await postcreateKind(kindData, token);
      }

      toast.success("Product and kinds created successfully");
    } catch (error) {
      if (error.response && error.response.data && error.response.data.errors) {
        setErrors(error.response.data.errors);
        toast.error("Error creating product or kinds");
      } else {
        toast.error("An unexpected error occurred");
        console.error("Error creating product or kinds:", error);
      }
    }
  };

  return (
    <>
      <ToastContainer />
      <section className="flex flex-col items-start text-base font-medium tracking-tight text-center text-black max-md:flex-wrap max-md:pr-5">
        <div className="flex flex-col justify-between w-full px-2.5 py-2.5 bg-white">
          <h2 className="text-left text-pink-500 mb-4">Add Product</h2>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col px-2.5 py-2.5 bg-white">
              <div className="flex items-center mb-2">
                <label htmlFor="name" className="w-1/4 text-left">Name</label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  className="w-2/4 p-2 border rounded"
                  placeholder="Name"
                  value={product.name}
                  onChange={handleProductChange}
                />
              </div>
              {errors.ProductName && <p className="text-red-500">{errors.ProductName}</p>}
            </div>
            <div className="flex flex-col px-2.5 py-2.5 bg-white">
              <div className="flex items-center mb-2">
                <label htmlFor="category" className="w-1/4 text-left">Category</label>
                <select
                  id="category"
                  name="categoryId"
                  className="w-2/4 p-2 border rounded"
                  value={product.categoryId}
                  onChange={handleProductChange}
                >
                  <option value="">Select Category</option>
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>{category.categoryName}</option>
                  ))}
                </select>
              </div>
              {errors.CategoryId && <p className="text-red-500">{errors.CategoryId}</p>}
            </div>
            <div className="flex flex-col px-2.5 py-2.5 bg-white">
              <div className="flex items-center mb-2">
                <label htmlFor="discount" className="w-1/4 text-left">Discount</label>
                <select
                  id="discount"
                  name="discountId"
                  className="w-2/4 p-2 border rounded"
                  value={product.discountId}
                  onChange={handleProductChange}
                >
                  <option value="">Select Discount</option>
                  {discounts.map(discount => (
                    <option key={discount.id} value={discount.id}>{`Discount ${discount.percent}% - Expires on ${discount.expiredDate}`}</option>
                  ))}
                </select>
              </div>
              {errors.DiscountId && <p className="text-red-500">{errors.DiscountId}</p>}
            </div>
            <div className="flex flex-col px-2.5 py-2.5 bg-white">
              <div className="flex items-center mb-2">
                <label htmlFor="price" className="w-1/4 text-left">Price</label>
                <input
                  id="price"
                  name="price"
                  type="text"
                  className="w-2/4 p-2 border rounded"
                  placeholder="1,2,3,..."
                  value={product.price}
                  onChange={handleProductChange}
                />
              </div>
              {errors.ProductPrice && <p className="text-red-500">{errors.ProductPrice}</p>}
            </div>
            <div className="flex flex-col px-2.5 py-2.5 bg-white">
              <div className="flex items-center mb-2">
                <label htmlFor="description" className="w-1/4 text-left">Description</label>
                <textarea
                  id="description"
                  name="description"
                  className="w-2/4 p-2 border rounded"
                  placeholder="1,2,3,..."
                  value={product.description}
                  onChange={handleProductChange}
                ></textarea>
              </div>
              {errors.ProductDescription && <p className="text-red-500">{errors.ProductDescription}</p>}
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
                    className="w-2/4 p-2 border rounded"
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
                    className="w-2/4 p-2 border rounded"
                    placeholder="1,2,3,..."
                    value={kind.quantity}
                    onChange={(e) => handleKindChange(index, e)}
                  />
                </div>
                <div className="flex items-center mb-2">
                  <label htmlFor={`file-${index}`} className="w-1/4 text-left">Image</label>
                  <input
                    id={`file-${index}`}
                    name="file"
                    type="file"
                    className="w-2/4 p-2 border rounded"
                    onChange={(e) => handleKindChange(index, e)}
                  />
                </div>
                <button type="button" onClick={() => removeKind(index)} className="text-red-500">Remove Kind</button>
              </div>
            ))}
            <Button onClick={addKind}>Add Kind</Button>
            <div className="flex justify-center py-2.5 bg-white">
              <Button type="submit">Save</Button>
            </div>
          </form>
        </div>
      </section>
    </>
  );
}

function AdminProduct() {
  return (
    <div className="h-screen bg-white flex">
      <Sidebar />
      <main className="flex flex-col w-full overflow-auto">
        <header className="flex flex-col self-stretch my-auto max-md:mt-4 max-md:max-w-full">
          <AdminHeader title="Add Product" extraContent={null} />
          <section className="flex flex-col px-6 pt-6 mt-4 bg-white border-t border-solid border-black border-opacity-30 max-md:pr-5 max-md:max-w-full">
            <div className="mx-4 max-md:mr-2.5 max-md:max-w-full">
              <AddProductForm />
            </div>
          </section>
        </header>
      </main>
    </div>
  );
}

export default AdminProduct;
