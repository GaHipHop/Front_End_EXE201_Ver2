import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CreateIcon from '@mui/icons-material/Create';
import DeleteIcon from '@mui/icons-material/Delete';
import InfoIcon from '@mui/icons-material/Info';
import UpdateIcon from '@mui/icons-material/Update';
import { Box, Button, Modal, Pagination, Stack, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material';
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  availableProduct,
  deletetProduct,
  getAllProduct,
  getAllProductByStatusFalse,
  GetProductById
} from "../../../lib/service/productService";
import AdminHeader from "../adminLayout/AdminHeader";
import Sidebar from "../adminLayout/Sidebar";

function ProductList() {
  const [products, setProducts] = useState([]);
  const [filteredProduct, setFilteredProduct] = useState([]);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [currentFilter, setCurrentFilter] = useState('true');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(6);
  const navigate = useNavigate();

  const fetchProducts = async (filter) => {
    try {
      const token = localStorage.getItem('token');
      let response;
      if (filter === 'true') {
        response = await getAllProduct();
      } else {
        response = await getAllProductByStatusFalse(token);
      }

      if (response.data.status === 404) {
        setProducts([]);
        setFilteredProduct([]);
        toast.error("No products found");
      } else {
        setProducts(response.data.data || []);
        setFilteredProduct(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching products:", error.message);
      setProducts([]);
      setFilteredProduct([]);
    }
  };

  useEffect(() => {
    fetchProducts(currentFilter);
  }, [currentFilter]);

  const handleSearch = (event) => {
    const searchTerm = event.target.value.toLowerCase();
    const filtered = products.filter(product =>
      product.productName.toLowerCase().includes(searchTerm)
    );
    setFilteredProduct(filtered);
    setPage(1); // Reset to first page after search
  };

  const handleDropdownClick = (product) => {
    setSelectedProduct(product);
    setDropdownVisible(!dropdownVisible);
  };

  const handleAction = async (action) => {
    if (!selectedProduct) return;
    const token = localStorage.getItem('token');
    if (action === 'Detail') {
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };
      const response = await GetProductById(selectedProduct.id, config);
      setSelectedProduct(response.data.data);
      setDetailModalOpen(true);
    } else if (action === 'Update') {
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };
      const response = await GetProductById(selectedProduct.id, config);
      const productToUpdate = response.data.data;
      navigate('/admin/updateProducts', { state: { product: productToUpdate } });
    } else if (action === 'Delete') {
      try {
        if (currentFilter === 'true') {
          await deletetProduct(selectedProduct.id, token);
          toast.success("Product deleted successfully");
        } else if (currentFilter === 'false') {
          await availableProduct(selectedProduct.id, token);
          toast.success("Product set to available successfully");
        }
        fetchProducts(currentFilter);
      } catch (error) {
        toast.error("Error processing request");
        console.error("Error processing request:", error);
      }
    }
    setDropdownVisible(false);
  };

  const handleCloseModal = () => {
    setDetailModalOpen(false);
  };

  const handleFilterChange = (filter) => {
    setCurrentFilter(filter);
  };

  const handleCreate = () => {
    navigate('/admin/createProducts');
  };

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const paginatedProducts = filteredProduct.slice((page - 1) * pageSize, page * pageSize);

  function ProductTable({ products = [] }) {
    return (
      <section className="flex flex-col items-start text-base font-medium tracking-tight text-center text-black max-md:flex-wrap max-md:pr-5">
        <div className="flex justify-between w-full px-2.5 py-2.5 bg-white">
          <div className="flex-1 flex justify-center items-center">
            <span>No</span>
          </div>
          <div className="flex-1 flex justify-center items-center">
            <span>Product ID</span>
          </div>
          <div className="flex-1 flex justify-center items-center">
            <span>Product Name</span>
          </div>
          <div className="flex-1 flex justify-center items-center">
            <span>Stock Quantity</span>
          </div>
          <div className="flex-1 flex justify-center items-center">
            <span>Current Price</span>
          </div>
          <div className="flex-1 flex justify-center items-center">
            <span>Action</span>
          </div>
        </div>
        {products.length > 0 ? (
          products.map((product, index) => (
          <div
            key={index}
            className="flex justify-between w-full px-2.5 py-2.5 text-base tracking-tight text-black bg-white max-md:flex-wrap"
          >
            <div className="flex-1 flex justify-center items-center text-center font-plus-jakarta break-words">
              {index + 1 + (page - 1) * pageSize}
            </div>
            <div className="flex-1 flex justify-center items-center text-center font-plus-jakarta break-words">
              {product.id}
            </div>
            <div className="flex-1 flex justify-center items-center text-center font-plus-jakarta break-words">
              <span>{product.productName}</span>
            </div>
            <div className="flex-1 flex justify-center items-center text-center font-plus-jakarta break-words">
              <span>{product.stockQuantity}</span>
            </div>
            <div className="flex-1 flex justify-center items-center text-center font-plus-jakarta break-words">
              <span>{product.currentPrice.toLocaleString('vi-VN', {
                style: 'currency',
                currency: 'VND',
              })}</span>
            </div>
            <div className="relative flex-1 flex justify-center items-center text-center font-plus-jakarta break-words">
              <span onClick={() => handleDropdownClick(product)}>...</span>
              {dropdownVisible && selectedProduct === product && (
                <div
                  className="absolute top-full mt-2 shadow-lg border rounded"
                  style={{
                    backgroundColor: '#ffffff',
                    border: '1px solid #e0e0e0',
                    zIndex: 10
                  }}
                >
                  <ul>
                    <li className="p-2 cursor-pointer flex items-center" onClick={() => handleAction('Detail')}>
                      <InfoIcon className="mr-2" /> Detail
                    </li>
                    {currentFilter === 'true' && (
                      <>
                        <li className="p-2 cursor-pointer flex items-center" onClick={() => handleAction('Update')}>
                          <UpdateIcon className="mr-2" /> Update
                        </li>
                        <li className="p-2 cursor-pointer flex items-center" onClick={() => handleAction('Delete')}>
                          <DeleteIcon className="mr-2" /> Delete
                        </li>
                      </>
                    )}
                    {currentFilter === 'false' && (
                      <li className="p-2 cursor-pointer flex items-center" onClick={() => handleAction('Delete')}>
                        <CheckCircleIcon className="mr-2" /> Available
                      </li>
                    )}
                  </ul>
                </div>
              )}
            </div>
          </div>
        ))
      ) : (
        <div className="flex justify-center w-full px-2.5 py-2.5 text-base tracking-tight text-black bg-white max-md:flex-wrap">
          No available product
        </div>
      )}
      </section>
    );
  }

  function ProductDetailModal({ product, open, onClose }) {
    if (!product) return null;

    return (
      <Modal open={open} onClose={onClose}>
        <Box sx={{
          p: 4,
          bgcolor: 'background.paper',
          borderRadius: 1,
          width: '80%',
          maxWidth: '800px',
          maxHeight: '80vh',
          overflowY: 'auto',
          mx: 'auto',
          my: '5%',
          position: 'absolute',
          top: '35%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          boxShadow: 24
        }}>
          <Typography variant="h5" gutterBottom>
            Product Details
          </Typography>
          <Table>
            <TableBody>
              <TableRow>
                <TableCell variant="head">Product Name</TableCell>
                <TableCell>{product.productName}</TableCell>
              </TableRow>
              {product.category && (
                <TableRow>
                  <TableCell variant="head">Category</TableCell>
                  <TableCell>{product.category.categoryName}</TableCell>
                </TableRow>
              )}
              {product.discount && (
                <TableRow>
                  <TableCell variant="head">Discount</TableCell>
                  <TableCell>{product.discount.percent}% until {new Date(product.discount.expiredDate).toLocaleDateString()}</TableCell>
                </TableRow>
              )}
              <TableRow>
                <TableCell variant="head">Stock Quantity</TableCell>
                <TableCell>{product.stockQuantity}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell variant="head">Description</TableCell>
                <TableCell>{product.productDescription}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell variant="head">Price</TableCell>
                <TableCell>{product.productPrice.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell variant="head">Current Price</TableCell>
                <TableCell>{product.currentPrice.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell variant="head">Created Date</TableCell>
                <TableCell>{new Date(product.createDate).toLocaleDateString()}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell variant="head">Modified Date</TableCell>
                <TableCell>{new Date(product.modifiedDate).toLocaleDateString()}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell variant="head">Status</TableCell>
                <TableCell>{product.status ? 'Active' : 'Inactive'}</TableCell>
              </TableRow>
              {product.discount && (
                <TableRow>
                  <TableCell variant="head">Discount</TableCell>
                  <TableCell>{product.discount.percent}%</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          <Typography variant="h6" sx={{ mt: 2 }}>
            Kinds
          </Typography>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Color</TableCell>
                <TableCell>Quantity</TableCell>
                <TableCell>Image</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {product.kinds && product.kinds.length > 0 ? (
                product.kinds.map((kind) => (
                  <TableRow key={kind.id}>
                    <TableCell>
                      <div
                        style={{
                          width: '50px',
                          height: '50px',
                          backgroundColor: kind.colorName,
                          border: '1px solid #000'
                        }}
                      ></div>
                    </TableCell>
                    <TableCell>{kind.quantity}</TableCell>
                    <TableCell>
                      <img src={kind.image} alt={kind.colorName} style={{ width: '50px', height: '50px' }} />
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={3} align="center">No kinds available</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          <Box sx={{ mt: 2, textAlign: 'right' }}>
            <Button onClick={onClose} variant="contained" color="primary">
              Close
            </Button>
          </Box>
        </Box>
      </Modal>
    );
  }

  return (
    <div className="h-screen bg-white flex">
      <Sidebar />
      <main className="flex flex-col w-full overflow-auto">
        <header className="admin-header">
          <AdminHeader title="Manage Product" />
        </header>
        <ToastContainer />
        <style>
          {`
            .custom-button {
             color: black;
             background-color: #d3d3d3;
             padding: 8px 16px;
             border-radius: 8px;
             cursor: pointer;
            } 

            .custom-button.selected {
             background-color: #f4bbff;
            }

            .custom-button:hover {
             background-color: lightgray;
            }

          `}
        </style>
        <section className="flex flex-col px-6 pt-6 mt-4 bg-white border-t border-solid border-black border-opacity-30 max-md:pr-5 max-md:max-w-full">
          <div className="search-and-tabs mx-4 max-md:mr-2.5 max-md:max-w-full flex justify-between items-center">
            <div className="flex space-x-4 w-full justify-between items-center">
              <input
                type="text"
                placeholder="Search..."
                className="px-3 py-1.5 rounded-2xl border border-gray-300 focus:outline-none focus:border-pink-300 w-1/3"
                onChange={handleSearch}
              />
              <div className="flex space-x-4">
                <Button className={`custom-button ${currentFilter === 'true' ? 'selected' : ''}`} onClick={() => handleFilterChange('true')}>Available</Button>
                <Button className={`custom-button ${currentFilter === 'false' ? 'selected' : ''}`} onClick={() => handleFilterChange('false')}>UnAvailable</Button>
              </div>
            </div>
          </div>
          <div className="mx-4 max-md:mr-2.5 max-md:max-w-full">
            <Button
              className="custom-button"
              onClick={handleCreate}
              startIcon={<CreateIcon />}
              style={{ marginBottom: '16px', marginTop: '25px' }}
            >
              Create
            </Button>
            <ProductTable products={paginatedProducts} />
          </div>
          <Stack spacing={3} className="mt-8" direction="row" justifyContent="center">
            <Pagination
              count={Math.ceil(filteredProduct.length / pageSize)}
              page={page}
              onChange={handlePageChange}
              siblingCount={1}
              boundaryCount={1}
              showFirstButton showLastButton
            />
          </Stack>
        </section>
      </main>
      <ProductDetailModal product={selectedProduct} open={detailModalOpen} onClose={handleCloseModal} />
    </div>
  );
}

export default ProductList;
