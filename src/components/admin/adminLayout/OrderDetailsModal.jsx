import { Box, Button, Modal, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import React from 'react';

const getStatusColor = (status) => {
  switch (status) {
    case 'Confirmed':
      return 'lightgreen';
    case 'Rejected':
      return 'red';
    case 'Pending':
      return 'orange';
    default:
      return 'black';
  }
};

const OrderDetailsModal = ({ orders, visible, onClose }) => {
  if (!orders || orders.length === 0) return null;

  return (
    <Modal
      open={visible}
      onClose={onClose}
      aria-labelledby="modal-title"
    >
      <Box sx={{ width: '80%', maxHeight: '80vh', bgcolor: 'background.paper', padding: 4, margin: 'auto', marginTop: '5%', borderRadius: 1, overflowY: 'auto' }}>
        <Typography id="modal-title" variant="h6" component="h2" gutterBottom>
          Orders Details
        </Typography>
        {orders.map((order) => (
          <Box key={order.id} sx={{ mt: 2, borderBottom: '1px solid #ccc', paddingBottom: 2 }}>
            <Typography variant="body1"><strong>Order Code:</strong> {order.orderCode}</Typography>
            <Typography variant="body1"><strong>Create Date:</strong> {new Date(order.createDate).toLocaleString()}</Typography>
            <Typography variant="body1"><strong>Total Price:</strong> {order.totalPrice}</Typography>
            <Typography variant="body1"><strong>User Info:</strong></Typography>
            <Typography variant="body2">{`Name: ${order.userInfo?.userName}`}</Typography>
            <Typography variant="body2">{`Email: ${order.userInfo?.email}`}</Typography>
            <Typography variant="body2">{`Phone: ${order.userInfo?.phone}`}</Typography>
            <Typography variant="body2">{`Address: ${order.userInfo?.address}`}</Typography>
            <Typography variant="body1" sx={{ mt: 2 }}><strong>Order Details:</strong></Typography>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Product</TableCell>
                    <TableCell>Quantity</TableCell>
                    <TableCell>Price</TableCell>
                    <TableCell>Color</TableCell>
                    <TableCell>Image</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {order.orderDetails.map((detail, detailIndex) => (
                    <TableRow key={detailIndex}>
                      <TableCell>{detail.productName}</TableCell>
                      <TableCell>{detail.orderQuantity}</TableCell>
                      <TableCell>{detail.orderPrice}</TableCell>
                      <TableCell>{detail.colorName}</TableCell>
                      <TableCell><img src={detail.image} alt={detail.productName} width="50" /></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        ))}
        <Button onClick={onClose} sx={{ mt: 2 }} variant="contained" color="error">
          Close
        </Button>
      </Box>
    </Modal>
  );
};

export default OrderDetailsModal;
