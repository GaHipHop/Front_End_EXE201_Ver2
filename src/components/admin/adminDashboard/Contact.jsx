import { Email, Facebook, Instagram, Phone, Store } from "@mui/icons-material";
import PublicIcon from '@mui/icons-material/Public';
import React, { useEffect, useState } from "react";
import { getAllContacts, updateContact } from "../../../lib/service/contactService"; // Điều chỉnh đường dẫn này nếu cần
import AdminHeader from "../adminLayout/AdminHeader";
import Sidebar from "../adminLayout/Sidebar";

function AdminContact() {
  const [contacts, setContacts] = useState([]);
  const [isEditing, setIsEditing] = useState(null);
  const [editData, setEditData] = useState({});

  const fetchContacts = async () => {
    try {
      const response = await getAllContacts(); // Gọi API lấy danh sách liên hệ
      setContacts(response.data.data || []);
      console.log(response.data);
    } catch (error) {
      console.error("Error fetching contacts:", error);
      setContacts([]);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  const handleEdit = (id) => {
    setIsEditing(id);
    const contact = contacts.find(contact => contact.id === id);
    setEditData(contact);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditData({
      ...editData,
      [name]: value
    });
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No token found');
      }
      await updateContact(isEditing, editData, token);
      fetchContacts(); // Refresh the contacts list after update
      setIsEditing(null);
    } catch (error) {
      console.error('Error updating contact:', error);
      if (error.response) {
        console.error('Response data:', error.response.data);
        console.error('Response status:', error.response.status);
        console.error('Response headers:', error.response.headers);
      } else if (error.request) {
        console.error('Request data:', error.request);
      } else {
        console.error('Error message:', error.message);
      }
    }
  };

  const handleCancel = () => {
    setIsEditing(null);
  };

  function ContactCard({ contact, isEdit, onInputChange }) {
    return (
      <div className="border rounded p-4 m-2 w-full bg-white shadow grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        <div className="border rounded p-6 text-center bg-gray-100 flex flex-col items-center">
          <Phone fontSize="large" className="mb-2" />
          {isEdit ? (
            <input
              type="text"
              name="phone"
              value={contact.phone || ''}
              onChange={onInputChange}
              className="w-full p-2 border rounded"
            />
          ) : (
            <>
              <span className="font-bold">Phone: </span>
              {contact.phone}
            </>
          )}
        </div>
        <div className="border rounded p-6 text-center bg-gray-100 flex flex-col items-center">
          <Email fontSize="large" className="mb-2" />
          {isEdit ? (
            <input
              type="text"
              name="email"
              value={contact.email || ''}
              onChange={onInputChange}
              className="w-full p-2 border rounded"
            />
          ) : (
            <>
              <span className="font-bold">Email: </span>
              {contact.email}
            </>
          )}
        </div>
        <div className="border rounded p-6 text-center bg-gray-100 flex flex-col items-center">
          <Facebook fontSize="large" className="mb-2" />
          {isEdit ? (
            <input
              type="text"
              name="facebook"
              value={contact.facebook || ''}
              onChange={onInputChange}
              className="w-full p-2 border rounded"
            />
          ) : (
            <>
              <span className="font-bold">Facebook: </span>
              {contact.facebook}
            </>
          )}
        </div>
        <div className="border rounded p-6 text-center bg-gray-100 flex flex-col items-center">
          <Instagram fontSize="large" className="mb-2" />
          {isEdit ? (
            <input
              type="text"
              name="instagram"
              value={contact.instagram || ''}
              onChange={onInputChange}
              className="w-full p-2 border rounded"
            />
          ) : (
            <>
              <span className="font-bold">Instagram: </span>
              {contact.instagram}
            </>
          )}
        </div>
        <div className="border rounded p-6 text-center bg-gray-100 flex flex-col items-center">
          <PublicIcon fontSize="large" className="mb-2" />
          {isEdit ? (
            <input
              type="text"
              name="tiktok"
              value={contact.tiktok || ''}
              onChange={onInputChange}
              className="w-full p-2 border rounded"
            />
          ) : (
            <>
              <span className="font-bold">Tiktok: </span>
              {contact.tiktok}
            </>
          )}
        </div>
        <div className="border rounded p-6 text-center bg-gray-100 flex flex-col items-center">
          <Store fontSize="large" className="mb-2" />
          {isEdit ? (
            <input
              type="text"
              name="shoppee"
              value={contact.shoppee || ''}
              onChange={onInputChange}
              className="w-full p-2 border rounded"
            />
          ) : (
            <>
              <span className="font-bold">Shopee: </span>
              {contact.shoppee}
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-white flex relative">
      <Sidebar />
      <main className="flex flex-col w-full overflow-auto">
        <header className="admin-header">
          <AdminHeader title="Contacts" />
        </header>
        <section className="flex flex-col items-center justify-center px-6 pt-6 mt-4 bg-white border-t border-solid border-black border-opacity-30 w-full relative">
          <div className="flex flex-wrap justify-center mx-4 max-w-full">
            {contacts.map((contact) => (
              <ContactCard
                key={contact.id}
                contact={isEditing === contact.id ? editData : contact}
                isEdit={isEditing === contact.id}
                onInputChange={handleInputChange}
              />
            ))}
          </div>
        </section>
        <div className="absolute bottom-4 right-4 flex space-x-2">
          {isEditing ? (
            <>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-green-500 text-white rounded"
              >
                Save
              </button>
              <button
                onClick={handleCancel}
                className="px-4 py-2 bg-gray-500 text-white rounded"
              >
                Back
              </button>
            </>
          ) : (
            <button
              onClick={() => handleEdit(contacts[0]?.id)}
              className="px-4 py-2 bg-blue-500 text-white rounded"
            >
              Update
            </button>
          )}
        </div>
      </main>
    </div>
  );
}

export default AdminContact;
