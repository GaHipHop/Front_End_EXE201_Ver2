import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFacebook,
  faInstagram,
  faTiktok,
} from "@fortawesome/free-brands-svg-icons";
import { faEnvelope, faPhone } from "@fortawesome/free-solid-svg-icons";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import { getAllContacts } from "../../lib/service/contactService";

function PolicyList() {
  const [open, setOpen] = useState(false);
  const [modalContent, setModalContent] = useState({ title: "", content: "" });

  const handleOpen = (title, content) => {
    setModalContent({ title, content });
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const policies = [
    { name: "About products", content: "Information about our products." },
    { name: "Private Policy", content: "Details on our privacy policy." },
    {
      name: "Delivery policy",
      content: "Information about our delivery policy.",
    },
  ];

  return (
    <div>
      <h2 className="text-xl font-plus-jakarta mb-2">Policy</h2>
      {policies.map((policy, index) => (
        <a
          key={index}
          href="#"
          onClick={(e) => {
            e.preventDefault();
            handleOpen(policy.name, policy.content);
          }}
          className="text-gray-600 hover:underline block font-open-sans"
        >
          {policy.name}
        </a>
      ))}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle className="bg-gray-100 font-playfair-display-sc text-xl">
          {modalContent.title}
        </DialogTitle>
        <DialogContent className="bg-gray-100 font-open-sans text-base text-gray-700">
          <p>{modalContent.content}</p>
        </DialogContent>
        <DialogActions className="bg-gray-100">
          <Button onClick={handleClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

function Contact() {
  const [contact, setContact] = useState(null);

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const response = await getAllContacts();
        if (response.data && response.data.data.length > 0) {
          setContact(response.data.data[0]);
        }
      } catch (error) {
        console.error("Error fetching contacts:", error);
      }
    };

    fetchContacts();
  }, []);

  if (!contact) return <p>Loading contact information...</p>;

  return (
    <div className="md:mr-4">
      <h2 className="text-xl font-plus-jakarta mb-2">Contact</h2>
      <p className="text-gray-600 mb-1 flex items-center font-open-sans">
        <FontAwesomeIcon
          icon={faEnvelope}
          style={{ width: "20px", height: "20px", marginRight: "10px" }}
        />
        <a href={`mailto:${contact.email}`} className="hover:underline">
          {contact.email}
        </a>
      </p>
      <p className="text-gray-600 flex items-center font-open-sans">
        <FontAwesomeIcon
          icon={faPhone}
          style={{ width: "20px", height: "20px", marginRight: "10px" }}
        />
        <a href={`tel:${contact.phone}`} className="hover:underline">
          {contact.phone}
        </a>
      </p>
    </div>
  );
}

function EcommerceSocial() {
  const [contact, setContact] = useState(null);

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const response = await getAllContacts();
        if (response.data && response.data.data.length > 0) {
          setContact(response.data.data[0]);
        }
      } catch (error) {
        console.error("Error fetching contacts:", error);
      }
    };

    fetchContacts();
  }, []);

  if (!contact) return <p>Loading social links...</p>;

  return (
    <div className="md:mr-4">
      <h2 className="text-xl font-plus-jakarta mb-2">Ecommerce</h2>
      <div className="flex space-x-5">
        <a href={contact.shoppee} target="_blank" rel="noopener noreferrer">
          <img
            src="/src/assets/image/icons8-shopee-50.png"
            alt="shopee"
            style={{ width: "20px", height: "20px" }}
          />
        </a>
      </div>
      <h2 className="text-xl font-plus-jakarta mb-2 mt-px">Social</h2>
      <div className="flex space-x-5">
        <a href={contact.facebook} target="_blank" rel="noopener noreferrer">
          <FontAwesomeIcon
            icon={faFacebook}
            style={{ width: "20px", height: "20px" }}
          />
        </a>
        <a href={contact.instagram} target="_blank" rel="noopener noreferrer">
          <FontAwesomeIcon
            icon={faInstagram}
            style={{ width: "20px", height: "20px" }}
          />
        </a>
        <a href={contact.tiktok} target="_blank" rel="noopener noreferrer">
          <FontAwesomeIcon
            icon={faTiktok}
            style={{ width: "20px", height: "20px" }}
          />
        </a>
      </div>
    </div>
  );
}

function Footer() {
  return (
    <footer className="bg-white border-t border-gray-300 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-start md:items-center">
        <div className="flex flex-col md:flex-row md:space-x-4 md:w-full">
          <div className="flex-1">
            <PolicyList />
          </div>
          <div className="flex-1 md:flex md:justify-center">
            <Contact />
          </div>
          <div className="flex-1 flex justify-end">
            <EcommerceSocial />
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
