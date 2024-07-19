import { Box, Button, Divider, FormControlLabel, Paper, Radio, RadioGroup, TextField, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createOrder, createPaymentLink } from '../../lib/service/orderService';

const Checkout = () => {
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [shippingFee, setShippingFee] = useState(30000); // Phí ship cố định
  const [shippingInfo, setShippingInfo] = useState({
    fullName: '',
    email: '',
    phone: '',
    city: '',
    district: '',
    ward: '',
    address: '',
    orderRequirement: ''
  });
  const [paymentMethod, setPaymentMethod] = useState('ATM');
  const [errors, setErrors] = useState({
    fullName: false,
    email: false,
    phone: false,
    city: false,
    ward: false,
    address: false
  });
  const navigate = useNavigate();

  useEffect(() => {
    // Lấy giỏ hàng từ localStorage
    const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    const totalPrice = cartItems.reduce((sum, item) => sum + item.productPrice * item.quantity, 0);
    setCartItems(cartItems);
    setTotalPrice(totalPrice + shippingFee); // Cộng thêm phí ship vào tổng giá
  }, [shippingFee]);

  const handlePayment = async () => {
    // Kiểm tra xem các trường thông tin đã nhập đầy đủ chưa
    if (!shippingInfo.fullName ||
        !shippingInfo.email ||
        !shippingInfo.phone ||
        !shippingInfo.city ||
        !shippingInfo.ward ||
        !shippingInfo.address) {
      // Cập nhật lỗi cho từng trường thông tin thiếu
      setErrors({
        fullName: !shippingInfo.fullName,
        email: !shippingInfo.email,
        phone: !shippingInfo.phone,
        city: !shippingInfo.city,
        ward: !shippingInfo.ward,
        address: !shippingInfo.address
      });
      return;
    }

    // Tạo dữ liệu order
    const orderData = {
      userName: shippingInfo.fullName,
      email: shippingInfo.email,
      phone: shippingInfo.phone,
      province: shippingInfo.city,
      wards: shippingInfo.ward,
      address: shippingInfo.address,
      orderRequirement: shippingInfo.orderRequirement,
      paymentMethod: paymentMethod,
      cartItems: cartItems.map(item => ({
        id: item.id,
        quantity: item.quantity,
        productPrice: item.productPrice,
        productName: item.productName,
        productImage: item.productImage,
        color: item.color
      }))
    };

    try {
      let productPrice = 5000;

      if (paymentMethod === 'COD') {
          productPrice = 30000;
         }

      const paymentLinkData = {
        productName: 'GaHipHop',
        description: 'GaHipHop',
        price: productPrice, 
        returnUrl: "http://localhost:5174/payment-success",
        cancelUrl: "http://localhost:5174/payment-fail",
      };

      const paymentResponse = await createPaymentLink(paymentLinkData);
      const paymentUrl = paymentResponse.data.data;
      console.log(paymentUrl);

      if (paymentUrl) {
        window.location.href = paymentUrl.checkoutUrl;
        const createOrderResponse = await createOrder(orderData);
        console.log('Create Order Response:', createOrderResponse);
        localStorage.removeItem('cartItems');
      }
    } catch (error) {
      console.error('Failed to create order:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setShippingInfo(prevState => ({
      ...prevState,
      [name]: value
    }));
    
    // Xóa lỗi khi người dùng điền lại
    setErrors(prevErrors => ({
      ...prevErrors,
      [name]: false
    }));
  };

  return (
    <Box sx={{ padding: 4, marginTop: 8 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 4 }}>
        <Paper sx={{ padding: 4, width: { xs: '100%', md: '60%' }, boxShadow: 3 }}>
          <Typography variant="h6" gutterBottom>THÔNG TIN GIAO HÀNG</Typography>
          <Divider sx={{ marginBottom: 2 }} />
          <TextField 
            label="Full Name" 
            name="fullName" 
            value={shippingInfo.fullName} 
            onChange={handleInputChange} 
            fullWidth 
            margin="normal" 
            required
            error={errors.fullName}  // Hiển thị lỗi nếu không nhập đầy đủ
            helperText={errors.fullName ? 'Please enter your full name' : ''}
          />
          <TextField 
            label="Email" 
            name="email" 
            value={shippingInfo.email} 
            onChange={handleInputChange} 
            fullWidth 
            margin="normal" 
            required
            error={errors.email}  // Hiển thị lỗi nếu không nhập đầy đủ
            helperText={errors.email ? 'Please enter your email' : ''}
          />
          <TextField 
            label="Phone" 
            name="phone" 
            value={shippingInfo.phone} 
            onChange={handleInputChange} 
            fullWidth 
            margin="normal" 
            required
            error={errors.phone}  // Hiển thị lỗi nếu không nhập đầy đủ
            helperText={errors.phone ? 'Please enter your phone number' : ''}
          />
          <TextField 
            label="City/Province" 
            name="city" 
            value={shippingInfo.city} 
            onChange={handleInputChange} 
            fullWidth 
            margin="normal" 
            required
            error={errors.city}  // Hiển thị lỗi nếu không nhập đầy đủ
            helperText={errors.city ? 'Please enter your city/province' : ''}
          />
          <TextField 
            label="Ward" 
            name="ward" 
            value={shippingInfo.ward} 
            onChange={handleInputChange} 
            fullWidth 
            margin="normal" 
            required
            error={errors.ward}  // Hiển thị lỗi nếu không nhập đầy đủ
            helperText={errors.ward ? 'Please enter your ward' : ''}
          />
          <TextField 
            label="Street" 
            name="address" 
            value={shippingInfo.address} 
            onChange={handleInputChange} 
            fullWidth 
            margin="normal" 
            required
            error={errors.address}  // Hiển thị lỗi nếu không nhập đầy đủ
            helperText={errors.address ? 'Please enter your street address' : ''}
          />
          <TextField 
            label="Order Requirement" 
            name="orderRequirement" 
            value={shippingInfo.orderRequirement} 
            onChange={handleInputChange} 
            fullWidth 
            margin="normal" 
          />
        </Paper>
        <Paper sx={{ padding: 4, width: { xs: '100%', md: '35%' }, boxShadow: 3 }}>
          <Typography variant="h6" gutterBottom>Payment methods</Typography>
          <Divider sx={{ marginBottom: 2 }} />
          <RadioGroup
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
          >
            <FormControlLabel value="ATM" control={<Radio />} label="Pay (ATM, Visa)" />
            <FormControlLabel value="COD" control={<Radio />} label="Payment on delivery (COD)" />
          </RadioGroup>
          <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>Order Summary</Typography>
          <Divider sx={{ marginBottom: 2 }} />
          {cartItems.map((item) => (
            <Box key={item.id} sx={{ display: 'flex', alignItems: 'center', marginBottom: 2 }}>
              <img src={item.productImage} alt={item.productName} style={{ width: '50px', marginRight: '10px' }} />
              <Box>
                <Typography variant="body1">{item.productName}</Typography>
                <Typography variant="body2" color="text.secondary">Quantity: {item.quantity}</Typography>
                <Typography variant="body2" color="text.secondary">Price: {item.productPrice.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</Typography>
              </Box>
            </Box>
          ))}
          <Divider sx={{ marginBottom: 2 }} />
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="body1">Subtotal:</Typography>
            <Typography variant="body1">{(totalPrice - shippingFee).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="body1">Shipping Fee:</Typography>
            <Typography variant="body1">{shippingFee.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</Typography>
          </Box>
          <Divider sx={{ marginY: 2 }} />
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="h6">Total:</Typography>
            <Typography variant="h6">{totalPrice.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</Typography>
          </Box>
          <Button 
            variant="contained" 
            color="primary" 
            fullWidth 
            onClick={handlePayment} 
            sx={{ mt: 2 }}
          >
            Pay
          </Button>
        </Paper>
      </Box>
    </Box>
  );
};

export default Checkout;
