import { Box, Button, Modal, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material';
import React, { useEffect, useRef, useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getOrders, importTransaction } from '../../../lib/service/orderService'; // API mới để lấy tất cả đơn hàng
import AdminHeader from '../adminLayout/AdminHeader';
import Sidebar from '../adminLayout/Sidebar';

function Transaction() {
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const fileInputRef = useRef(null);
  useEffect(() => {
    fetchTransactions(currentPage);
  }, [currentPage]);

  const fetchTransactions = async (page) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No token found');
      }

      const response = await getOrders('', page, 10, token); // API lấy tất cả đơn hàng
      const data = response.data;
      console.log('Fetched transactions:', data);
      setTransactions(data);
      setFilteredTransactions(data);
    } catch (error) {
      console.error('Error fetching transactions:', error.message);
      toast.error('Error fetching transactions: ' + error.message); // Hiển thị thông báo lỗi
    }
  };

  const handleSearch = (event) => {
    const searchTerm = event.target.value.toLowerCase();
    const filtered = transactions.filter(transaction =>
      transaction.orderCode.toLowerCase().includes(searchTerm)
    );
    setFilteredTransactions(filtered);
  };

  const handleDetailsClick = (event, transaction) => {
    setSelectedTransaction(transaction);
    setIsModalOpen(true); // Mở modal trực tiếp
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedTransaction(null);
  };

  const handleImportClick = () => {
    fileInputRef.current.click();
  };
  
  const handleFileChange = async (event) => {
    const file = event.target.files[0]; // Lấy tệp từ sự kiện
    if (file) {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No token found');
        }

        // Tạo FormData để gửi tệp lên server
        const formData = new FormData();
        formData.append('file', file);

        // Gọi API importTransaction
        await importTransaction(formData, token);
        toast.success('Import successful!');
        fetchTransactions(currentPage);
      } catch (error) {
        console.error('Error importing transactions:', error.message);
        toast.error('Error importing transactions: ' + error.message);
      }
    }
  };
  

  return (
    <div className="h-screen bg-white flex">
      <Sidebar />
      <main className="flex flex-col w-full overflow-auto">
        <header className="admin-header">
          <AdminHeader title="TRANSACTION" />
        </header>
        <style>
          {`
            .custom-button {
              color: black;
              background-color: #d3d3d3;
            }
            .custom-button:hover {
              background-color: lightgray;
            }
            .search-and-tabs {
              margin-bottom: 20px; /* Adjust the value to create the desired space */
            }
          `}
        </style>
        <section className="flex flex-col px-6 pt-6 mt-4 bg-white border-t border-solid border-black border-opacity-30 max-md:pr-5 max-md:max-w-full">
          <div className="search-and-tabs mx-4 max-md:mr-2.5 max-md:max-w-full flex justify-between items-center">
            <input
              type="text"
              placeholder="Search..."
              className="px-3 py-1.5 rounded-2xl border border-gray-300 focus:outline-none focus:border-pink-300 w-1/3"
              onChange={handleSearch}
            />
            <Button
              onClick={handleImportClick}
              className="custom-button"
            >
              Import
            </Button>
            {/* Hidden file input */}
            <input
              name="file"
              type="file"
              ref={fileInputRef}
              className="hidden"
              onChange={handleFileChange}
            />
          </div>
          <TransactionTable transactions={filteredTransactions} onDetailsClick={handleDetailsClick} />
          <div className="pagination mx-4 mt-4 flex justify-between items-center">
            <Button
              onClick={() => setCurrentPage(prevPage => Math.max(prevPage - 1, 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <span>Page {currentPage}</span>
            <Button
              onClick={() => setCurrentPage(prevPage => prevPage + 1)}
            >
              Next
            </Button>
          </div>
        </section>
      </main>

      {selectedTransaction && (
        <Modal open={isModalOpen} onClose={handleCloseModal}>
          <Box sx={{ p: 4, bgcolor: 'background.paper', borderRadius: 1, width: '600px', mx: 'auto' }}>
            <Typography variant="h6">Transaction Details</Typography>
            <Typography variant="body1">Order Code: {selectedTransaction.orderCode}</Typography>
            <Typography variant="body1">Create Date: {new Date(selectedTransaction.createDate).toLocaleDateString()}</Typography>
            <Typography variant="body1">Total Price: {selectedTransaction.totalPrice.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</Typography>
            <Typography variant="body1">User Name: {selectedTransaction.userInfo.userName}</Typography>
            <Typography variant="body2">Order Details:</Typography>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Product Name</TableCell>
                  <TableCell>Color</TableCell>
                  <TableCell>Quantity</TableCell>
                  <TableCell>Price</TableCell>
                  <TableCell>Image</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {selectedTransaction.orderDetails.map((detail) => (
                  <TableRow key={detail.id}>
                    <TableCell>{detail.productName}</TableCell>
                    <TableCell>{detail.colorName}</TableCell>
                    <TableCell>{detail.orderQuantity}</TableCell>
                    <TableCell>{detail.orderPrice.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</TableCell>
                    <TableCell>
                      <img src={detail.image} alt={detail.productName} style={{ width: '50px', height: '50px' }} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <Button onClick={handleCloseModal} className="mt-2">Close</Button>
          </Box>
        </Modal>
      )}

      <ToastContainer />
    </div>
  );
}

function TransactionTable({ transactions, onDetailsClick }) {
  return (
    <section className="flex flex-col items-start text-base font-medium tracking-tight text-center text-black max-md:flex-wrap max-md:pr-5">
      <div className="flex justify-between w-full px-2.5 py-2.5 bg-white">
      <div className="flex-1 flex justify-center items-center">
          <span>No</span>
        </div>
        <div className="flex-1 flex justify-center items-center">
          <span>Order Code</span>
        </div>
        <div className="flex-1 flex justify-center items-center">
          <span>Product</span>
        </div>
        <div className="flex-1 flex justify-center items-center">
          <span>Create Date</span>
        </div>
        <div className="flex-1 flex justify-center items-center">
          <span>Total Price</span>
        </div>
        <div className="flex-1 flex justify-center items-center">
          <span>User Name</span>
        </div>
        <div className="flex-1 flex justify-center items-center">
          <span>Action</span>
        </div>
      </div>
      <TransactionTableBody transactions={transactions} onDetailsClick={onDetailsClick} />
    </section>
  );
}

function TransactionTableBody({ transactions = [], onDetailsClick }) {
  return (
    <>
      {transactions.length > 0 ? (
        transactions.map((transaction, index) => (
          <div
            key={transaction.id}
            className="flex justify-between w-full px-2.5 py-2.5 text-base tracking-tight text-black bg-white max-md:flex-wrap"
          >
            <div className="flex-1 flex justify-center items-center text-center font-plus-jakarta break-words">
              {index + 1}
            </div>
            <div className="flex-1 flex justify-center items-center text-center font-plus-jakarta break-words">
              {transaction.orderCode}
            </div>
            <div className="flex-1 flex justify-center items-center text-center font-plus-jakarta break-words">
            {transaction.orderDetails.map(detail => detail.productName).join(', ')}
            </div>
            <div className="flex-1 flex justify-center items-center text-center font-plus-jakarta break-words">
              {new Date(transaction.createDate).toLocaleDateString()}
            </div>
            <div className="flex-1 flex justify-center items-center text-center font-plus-jakarta break-words">
              {transaction.totalPrice.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
            </div>
            <div className="flex-1 flex justify-center items-center text-center font-plus-jakarta break-words">
              {transaction.userInfo.userName}
            </div>
            <div className="flex-1 flex justify-center items-center text-center font-plus-jakarta break-words">
              <Button
                onClick={(e) => onDetailsClick(e, transaction)}
                className="text-blue-500"
              >
                Details
              </Button>
            </div>
          </div>
        ))
      ) : (
        <Typography>No transactions available</Typography>
      )}
    </>
  );
}

export default Transaction;
