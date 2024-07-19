import React, { useEffect } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const PaymentFail = () => {
  const navigate = useNavigate();

  useEffect(() => {
    toast.error('Payment Failed!');
    setTimeout(() => {
      navigate('/home');
    }, 2000);
  }, [navigate]);

  return <div>Redirecting to homepage...</div>;
};

export default PaymentFail;