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
            <img
              src="https://firebasestorage.googleapis.com/v0/b/gahiphop-4de10.appspot.com/o/images%2F0d1eceab-90ac-4889-a944-be364b08e3cb_GaHipHop.jpg?alt=media&token=fd839dec-ff8f-4f9f-8b5f-f5997475ce6d"
              alt="User"
              className="w-10 h-10 rounded-full"
            />
            <div className="ml-2 text-lg font-semibold text-gray-700">{userEmail}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminHeader;
