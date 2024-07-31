import React, { useEffect, useState } from 'react';

const AdminHeader = ({ title, extraContent }) => {
  const [userEmail, setUserEmail] = useState('');
  const [userName, setUserName] = useState('');
  const [userImage, setUserImage] = useState('');

  useEffect(() => {
    // Lấy thông tin người dùng từ localStorage
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    if (userInfo) {
      setUserEmail(userInfo.email);
      //setUserName(userInfo.fullName);
    }
  }, []);

  return (
    <div className="flex items-center w-full p-4 bg-white">
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center">
          <div className="bg-clip-text text-transparent font-plus-jakarta mt-5 ml-9">
            <span className="text-custom-purple text-5xl">{title}</span>
          </div>
          {extraContent && (
            <div className="ml-4">{extraContent}</div>
          )}
        </div>
        <div className="flex items-center">
          <span className="text-lg font-semibold text-gray-700 mr-4">{userName}</span>
          <div className="flex items-center">
            <div className="ml-2 text-lg font-semibold text-gray-700">Welcome, {userEmail}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminHeader;
