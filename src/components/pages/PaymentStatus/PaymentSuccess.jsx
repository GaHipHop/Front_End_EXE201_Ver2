import React, { useEffect } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const PaymentSuccess = () => {
  const navigate = useNavigate();

  useEffect(() => {
    toast.success('Payment Successful!');
    setTimeout(() => {
      navigate('/home');
    }, 2000);
  }, [navigate]);

  return <div>Redirecting to homepage...</div>;
};

export default PaymentSuccess;