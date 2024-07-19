import { Box, Button, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const SuccessPage = () => {
  const navigate = useNavigate();

  const handleContinueShopping = () => {
    navigate('/');
  };

  return (
    <div className="flex flex-col bg-white">
    <Box sx={{ padding: 4, textAlign: 'center', marginTop: 8 }}>
      <Typography variant="h4" gutterBottom>
        Thanh Toán Thành Công
      </Typography>
      <Typography variant="body1" gutterBottom>
        Cảm ơn bạn đã mua hàng! Đơn hàng của bạn đã được xử lý thành công.
      </Typography>
      <Button
        variant="contained"
        color="primary"
        sx={{ mt: 2 }}
        onClick={handleContinueShopping}
      >
        Tiếp Tục Mua Sắm
      </Button>
    </Box>
    </div>
  );
};

export default SuccessPage;
