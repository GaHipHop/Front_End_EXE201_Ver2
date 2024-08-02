import {
  faFacebook,
  faInstagram,
  faTiktok,
} from "@fortawesome/free-brands-svg-icons";
import { faShoppingCart } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { getAllContacts } from "../../lib/service/contactService";

function Footer() {
  const [contact, setContact] = useState(null);
  const [aboutOpen, setAboutOpen] = useState(false);
  const [currentDialog, setCurrentDialog] = useState("");

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

  const socialLinks = [
    {
      icon: faFacebook,
      link: contact ? contact.facebook : "#",
    },
    {
      icon: faInstagram,
      link: contact ? contact.instagram : "#",
    },
    {
      icon: faTiktok,
      link: contact ? contact.tiktok : "#",
    },
    {
      icon: faShoppingCart,
      link: contact ? contact.shoppee : "#",
    },
  ];

  const products = [
    {
      id: 1,
      section: "About",
      links: ["About Products", "How we work?"],
    },
    {
      id: 2,
      section: "Contact",
      links: contact ? [contact.email, contact.phone] : [],
    },
  ];

  const handleDialogOpen = (dialogName) => {
    setCurrentDialog(dialogName);
    setAboutOpen(true);
  };

  const handleClose = () => {
    setAboutOpen(false);
  };

  return (
    <div className="flex justify-center">
      <div className="max-w-7xl w-full">
        <div className="my-12 grid grid-cols-1 gap-y-10 sm:grid-cols-6 lg:grid-cols-12">
          {/* Column 1 */}
          <div
            className="sm:col-span-6 lg:col-span-5 flex flex-col items-center lg:items-start"
            style={{ marginLeft: 100 }}
          >
            <div className="flex flex-shrink-0 items-center">
              <img
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/0e4339a56fab22957162049c2f58e5884d8d2ea943f28743013a119ef8078b13?apiKey=402c56a5a1d94d11bd24e7050966bb9d&"
                alt="logo"
                width={66}
                height={66}
              />
            </div>
            <h3 className="text-xs font-medium text-gunmetalgray lh-160 mt-5 mb-4 lg:mb-16 text-center lg:text-left">
              Your ultimate destination for unique, creative, and stylish gifts
              and decorations.
            </h3>
            <div className="flex gap-4 justify-center lg:justify-start">
              {socialLinks.map((item, index) => (
                <a
                  href={item.link}
                  key={index}
                  className="bg-white h-12 w-12 shadow-xl text-base rounded-full flex items-center justify-center footer-icons hover:bg-ultramarine"
                >
                  <FontAwesomeIcon
                    icon={item.icon}
                    style={{ width: "20px", height: "20px" }}
                  />
                </a>
              ))}
            </div>
          </div>

          {/* Column 2/3/4 */}
          {products.map((product) => (
            <div
              key={product.id}
              className="sm:col-span-1 lg:col-span-3  flex flex-col items-center lg:items-start"
              style={{ marginLeft: 120 }}
            >
              <p className="text-black text-lg font-medium mb-9">
                {product.section}
              </p>
              <ul>
                {product.links.map((link, index) => (
                  <li key={index} className="mb-5">
                    {link === "About Products" ||
                    link === "How we work?" ||
                    link === "Privacy Policy" ||
                    link === "Terms & Conditions" ? (
                      <button
                        onClick={() => handleDialogOpen(link)}
                        className="text-darkgray text-base font-normal mb-6 space-links"
                      >
                        {link}
                      </button>
                    ) : (
                      <a
                        href="/"
                        className="text-darkgray text-base font-normal mb-6 space-links"
                      >
                        {link}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Dialogs for content */}
        <Dialog open={aboutOpen} onClose={handleClose}>
          <DialogTitle>{currentDialog}</DialogTitle>
          <DialogContent>
            {currentDialog === "About Products" && (
              <p>
                Handmade products are not only handmade items but also symbols
                of creativity and dedication. Each product is meticulously
                crafted by hand, from choosing ingredients to every small
                detail. Handmade items are not only beautiful but also carry the
                personal impression of the person who made them. In particular,
                they represent uniqueness and are never repeated, because each
                product is unique. In addition, handmade products also
                demonstrate sustainability and environmental friendliness,
                because they are often made from natural and recycled materials.
              </p>
            )}
            {currentDialog === "How we work?" && (
              <p>
                The way we work starts with finding inspiration and ideas,
                followed by choosing high-quality ingredients. Each product is
                created with attention to every detail, from swatching, cutting,
                sewing, to finishing. We always ensure that each product is not
                only beautiful but also sustainable and safe for users. We are
                proud of our working process and always strive to bring the best
                products to customers.
              </p>
            )}
            {currentDialog === "Privacy Policy" && (
              <p>
                Our Privacy Policy ensures that your personal information is
                protected and used responsibly. We collect and use your
                information only to provide the best services and products. Your
                data is secure with us and will not be shared with third
                parties, except with your consent or as required by law. We
                employ advanced security measures to safeguard your information
                from unauthorized access. For more details, please review our
                full Privacy Policy on our website.
              </p>
            )}
            {currentDialog === "Terms & Conditions" && (
              <p>
                By using our website and services, you agree to our Terms &
                Conditions. Our products and services are for personal use and
                may not be used for commercial purposes without permission. We
                reserve the right to modify or discontinue our offerings without
                prior notice. All content on our site is our property or
                licensed, and may not be reproduced without consent. For more
                details, please review our full Terms & Conditions on our
                website.
              </p>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="primary">
              Close
            </Button>
          </DialogActions>
        </Dialog>

        {/* All Rights Reserved */}
        <div className="py-10 flex flex-col md:flex-row items-center justify-between border-t border-t-gray-blue">
          <h4 className="text-dark-red opacity-75 text-sm text-center md:text-start font-normal">
            @2024.GaHipHop.All rights reserved
          </h4>
          <div className="flex gap-5 mt-5 md:mt-0 justify-center md:justify-start">
            <h4 className="text-dark-red opacity-75 text-sm font-normal">
              <button
                onClick={() => handleDialogOpen("Privacy Policy")}
                className="text-dark-red opacity-75 text-sm font-normal"
              >
                Privacy policy
              </button>
            </h4>
            <div className="h-5 bg-dark-red opacity-25 w-0.5"></div>
            <h4 className="text-dark-red opacity-75 text-sm font-normal">
              <button
                onClick={() => handleDialogOpen("Terms & Conditions")}
                className="text-dark-red opacity-75 text-sm font-normal"
              >
                Terms & conditions
              </button>
            </h4>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Footer;
