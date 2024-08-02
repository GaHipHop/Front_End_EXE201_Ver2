import { faCartShopping, faMagnifyingGlass, faBars } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  AppBar,
  Box,
  Drawer,
  IconButton,
  InputBase,
  Modal,
  Toolbar,
  Typography,
  useMediaQuery,
} from '@mui/material';
import { Button } from '@nextui-org/react';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import messengerIcon from 'src/assets/image/messenger.png';  // Adjust the path as necessary

const Header = ({ onCategorySelect }) => {
  const [searchOpen, setSearchOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [cartItemCount, setCartItemCount] = useState(0);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const inputRef = useRef(null);
  const navigate = useNavigate();
  const isMobile = useMediaQuery('(max-width:600px)');

  const handleSearchClick = () => {
    setSearchOpen(true);
  };

  const handleBlur = () => {
    setSearchOpen(false);
  };

  const handleSearchChange = (event) => {
    setSearchKeyword(event.target.value);
  };

  const handleSearchSubmit = () => {
    if (searchKeyword.trim() !== "") {
      navigate(`/product?search=${searchKeyword}`);
    }
  };

  useEffect(() => {
    if (searchOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [searchOpen]);

  const fetchCartItems = () => {
    try {
      const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
      const totalPrice = cartItems.reduce((sum, item) => sum + item.productPrice * item.quantity, 0);
      setCartItems(cartItems);
      setTotalPrice(totalPrice);
      setCartItemCount(cartItems.length);
    } catch (error) {
      console.error('Failed to fetch cart items:', error);
    }
  };

  const removeCartItem = (itemId) => {
    try {
      const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
      const updatedCartItems = cartItems.filter((item) => item.id !== itemId);
      localStorage.setItem('cartItems', JSON.stringify(updatedCartItems));
      setCartItems(updatedCartItems);
      const updatedTotalPrice = updatedCartItems.reduce((sum, item) => sum + item.productPrice * item.quantity, 0);
      setTotalPrice(updatedTotalPrice);
      setCartItemCount(updatedCartItems.length);
    } catch (error) {
      console.error('Failed to remove cart item:', error);
    }
  };

  const updateCartItemQuantity = (itemId, newQuantity) => {
    try {
      const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
      const updatedCartItems = cartItems.map((item) => {
        if (item.id === itemId) {
          return { ...item, quantity: newQuantity };
        }
        return item;
      });
      localStorage.setItem('cartItems', JSON.stringify(updatedCartItems));
      setCartItems(updatedCartItems);
      const updatedTotalPrice = updatedCartItems.reduce((sum, item) => sum + item.productPrice * item.quantity, 0);
      setTotalPrice(updatedTotalPrice);
      setCartItemCount(updatedCartItems.length);
    } catch (error) {
      console.error('Failed to update cart item quantity:', error);
    }
  };

  useEffect(() => {
    fetchCartItems(); // Fetch cart items when the component mounts
  }, []);

  useEffect(() => {
    if (isCartOpen) {
      fetchCartItems();
    }
  }, [isCartOpen]);

  // Uncomment and use if necessary for WebSocket chat integration
  // useEffect(() => {
  //   const script = document.createElement('script');
  //   script.type = 'text/javascript';
  //   script.id = 'hs-script-loader';
  //   script.async = true;
  //   script.defer = true;
  //   script.src = '//js-na1.hs-scripts.com/46686268.js';
  //   document.head.appendChild(script);

  //   return () => {
  //     document.head.removeChild(script);
  //   };
  // }, []);

  const formatCurrency = (value) => {
    return value.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
  };

  return (
    <AppBar position="sticky" color="default">
      <Toolbar className="flex justify-between items-center">
        {isMobile && (
          <IconButton edge="start" color="inherit" onClick={() => setDrawerOpen(true)}>
            <FontAwesomeIcon icon={faBars} />
          </IconButton>
        )}
        <div className="flex items-center space-x-4 font-poiret-one">
          <a href="/" className="flex items-center space-x-4 font-poiret-one">
            <img
              loading="lazy"
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/0e4339a56fab22957162049c2f58e5884d8d2ea943f28743013a119ef8078b13?apiKey=402c56a5a1d94d11bd24e7050966bb9d&"
              className="w-[60px]"
              alt="Logo"
            />
          </a>
          {!isMobile && (
            <>
              <Button variant="none" onClick={() => navigate('/product')}>
                <span className="text-[20px] hover:underline decoration-1 font-bold">All Products</span>
              </Button>
              <a
                href="/about"
                className="block text-[20px] hover:underline hover:decoration-black decoration-1 font-bold"
              >
                About Us
              </a>
            </>
          )}
        </div>
        <div className="absolute left-1/2 transform -translate-x-1/2 text-[40px] font-medium font-poiret-one font-sans">
          {!isMobile && <span>GaHipHop</span>}
        </div>
        <div className="flex items-center space-x-4 relative">
          {searchOpen ? (
            <InputBase
              inputRef={inputRef}
              className="h-10 w-[15rem]"
              placeholder="Tìm kiếm..."
              size="sm"
              type="search"
              onBlur={handleBlur}
              onChange={handleSearchChange}
              onKeyDown={(e) => e.key === 'Enter' && handleSearchSubmit()}
            />
          ) : (
            <FontAwesomeIcon
              icon={faMagnifyingGlass}
              size="lg"
              onClick={handleSearchClick}
              className="cursor-pointer"
            />
          )}
          <div className="relative">
            <FontAwesomeIcon
              icon={faCartShopping}
              size="lg"
              className="cursor-pointer"
              onClick={() => setIsCartOpen(true)}
            />
            {cartItemCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center">
                {cartItemCount}
              </span>
            )}
          </div>
        </div>
      </Toolbar>
      <Drawer anchor="left" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        <Box sx={{ width: 250, padding: 2 }}>
          <Typography variant="h6">Menu</Typography>
          <Button onClick={() => navigate('/product')}>All Products</Button>
          <Button onClick={() => navigate('/about')}>About Us</Button>
        </Box>
      </Drawer>
      <Modal open={isCartOpen} onClose={() => setIsCartOpen(false)}>
        <Box
          sx={{
            position: 'absolute',
            top: '30%',
            right: '10%',
            transform: 'translateY(-50%)',
            width: '300px',
            padding: 4,
            backgroundColor: 'white',
            borderRadius: 2,
          }}
        >
          <Typography variant="h6">Cart</Typography>
          {cartItems.length > 0 ? (
            cartItems.map((item) => (
              <Box key={item.id} sx={{ display: 'flex', alignItems: 'center', marginBottom: 2 }}>
                <img src={item.productImage} alt={item.productName} style={{ width: '50px', marginRight: '10px' }} />
                <Box sx={{ flexGrow: 1 }}>
                  <Typography variant="body1">{item.productName}</Typography>
                  <Typography variant="body2">Màu: {item.color}</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <IconButton onClick={() => updateCartItemQuantity(item.id, item.quantity - 1)} disabled={item.quantity === 1}>
                      <Typography>-</Typography>
                    </IconButton>
                    <input 
                      type="text" 
                      value={item.quantity} 
                      readOnly 
                      className="w-8 text-center mx-1 border border-gray-300 rounded" 
                    />
                    <IconButton onClick={() => updateCartItemQuantity(item.id, item.quantity + 1)}>
                      <Typography>+</Typography>
                    </IconButton>
                  </Box>
                  <Typography variant="body2">Price: {formatCurrency(item.productPrice)}</Typography>
                </Box>
                <IconButton onClick={() => removeCartItem(item.id)}>
                  <Typography>X</Typography>
                </IconButton>
              </Box>
            ))
          ) : (
            <Typography>No products.</Typography>
          )}
          <Typography variant="h6">Total: {formatCurrency(totalPrice)}</Typography>
        </Box>
      </Modal>

      {/* Messenger Icon */}
      <div
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          width: '50px',
          height: '50px',
          cursor: 'pointer',
          zIndex: 1000,
        }}
        onClick={() => window.open('https://m.me/nguyen.rosie.946/', '_blank')}
      >
        <img
          src={messengerIcon}
          alt="Messenger Icon"
          style={{
            width: '100%',
            height: '100%',
            borderRadius: '50%',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
          }}
        />
      </div>
    </AppBar>
  );
};

export default Header;
