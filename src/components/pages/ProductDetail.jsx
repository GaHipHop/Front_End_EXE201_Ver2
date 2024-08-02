import { Button } from "@nextui-org/react";
import { useEffect, useState } from 'react';
import { Link, useParams } from "react-router-dom";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { postCart } from '../../lib/service/cartService'; // Import dịch vụ giỏ hàng
import { GetKindById } from '../../lib/service/kindService';
import { GetProductById } from '../../lib/service/productService';

function KindList({ kinds, onKindClick }) {
  return (
    <div className="flex flex-wrap gap-4 justify-center">
      {kinds.map((kind, index) => (
        <div 
          key={index} 
          className="w-[calc(20%-10px)] flex flex-col items-center cursor-pointer transition-transform transform hover:scale-105" 
          onClick={() => onKindClick(kind.id)}
        >
          <img src={kind.image} alt={kind.colorName} className="w-[50%] h-auto" />
          <p className="mt-2 text-sm font-medium text-gray-700">{kind.colorName}</p>
        </div>
      ))}
    </div>
  );
}

const formatPrice = (price) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
};


const QuantitySelector = ({ initialQuantity = 1, onQuantityChange }) => {
  const [quantity, setQuantity] = useState(initialQuantity);

  const handleDecrease = () => {
    if (quantity > 1) {
      const newQuantity = quantity - 1;
      setQuantity(newQuantity);
      onQuantityChange(newQuantity);
    }
  };

  const handleIncrease = () => {
    const newQuantity = quantity + 1;
    setQuantity(newQuantity);
    onQuantityChange(newQuantity);
  };

  return (
    <div className="flex items-center">
      <Button auto light onClick={handleDecrease} className="px-4 py-2 bg-gray-200 rounded-l-md">-</Button>
      <input 
        type="text" 
        value={quantity} 
        readOnly 
        className="w-12 text-center mx-2 border border-gray-300 rounded-none" 
      />
      <Button auto light onClick={handleIncrease} className="px-4 py-2 bg-gray-200 rounded-r-md">+</Button>
    </div>
  );
};

function MainContent({ productId, onAddToCart, setKindId }) {
  const [kind, setKind] = useState(null);
  const [product, setProduct] = useState(null);
  const [kinds, setKinds] = useState([]);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchProductAndKinds = async () => {
      try {
        const productResponse = await GetProductById(productId);
        const productData = productResponse.data.data;
        setProduct(productData);

        const kindsData = productData.kinds;
        setKinds(kindsData);

        if (kindsData.length > 0) {
          const kindResponse = await GetKindById(kindsData[0].id);
          setKind(kindResponse.data.data);
          setKindId(kindsData[0].id);
        }
      } catch (error) {
        console.error('Failed to fetch product or kinds:', error);
      }
    };

    fetchProductAndKinds();
  }, [productId, setKindId]);

  const handleKindClick = async (kindId) => {
    try {
      const kindResponse = await GetKindById(kindId);
      setKind(kindResponse.data.data);
      setKindId(kindId);
    } catch (error) {
      console.error('Failed to fetch kind:', error);
    }
  };

  return (
    <main className="px-10 py-4 w-full bg-gray-50 border-t border-gray-300 max-md:px-5 max-md:max-w-full">
      {kind && (
        <div className="flex gap-6 max-md:flex-col max-md:gap-4">
          <div className="flex flex-col w-[75%] max-md:w-full mx-auto">
            <div className="flex flex-col grow max-md:mt-8">
              <Link to="/product" className="hover:underline mt-8">
                <img
                  loading="lazy"
                  src="https://cdn.builder.io/api/v1/image/assets/TEMP/4da31893cf6b60f515d90fcf502cdffa8eceb14b82bd89a7d1b0ec445f066ff2?apiKey=2d591b1c79224a4881e4a85e4f46aa1b&"
                  alt="icon"
                  className="aspect-[1.35] w-[30px]"
                />
              </Link>
              <div
                className="flex flex-col justify-center mt-10 bg-white rounded-[20px] max-md:mt-8 mx-auto"
                style={{ width: "250px", height: "250px" }}
              >
                <img
                  loading="lazy"
                  src={kind.image}
                  alt={kind.colorName}
                  className="w-full aspect-[0.8] object-cover rounded-[20px]"
                  style={{marginBottom: 10}}
                />
              </div>
            </div>
            {kinds.length > 0 && <KindList kinds={kinds} onKindClick={handleKindClick} />}
          </div>
          <section className="flex flex-col ml-3 w-[70%] max-md:ml-0 max-md:w-full">
            {product && (
              <div className="flex flex-col mt-16 text-xl tracking-tight text-gray-900 max-md:mt-8">
                <h3 className="leading-8 font-semibold">{product.productName}</h3>
                <p className="mt-2 text-gray-700">Category: {product.category.categoryName}</p>
                <p className="mt-5">
                  Price: {product.currentPrice !== product.productPrice ? (
                    <>
                      <span className="line-through text-gray-500">{formatPrice(product.productPrice)}</span> <span className="font-bold text-red-500">{formatPrice(product.currentPrice)}</span>
                    </>
                  ) : (
                    <span className="font-bold text-gray-900">{formatPrice(product.productPrice)}đ</span>
                  )}
                </p>
                {product.discount.percent > 0 && (
                  <p className="mt-1 text-gray-700">
                    Discount: {product.discount.percent}% - until {new Date(product.discount.expiredDate).toLocaleDateString()}
                  </p>
                )}
                <p className="mt-1 text-gray-700">Color: {kind.colorName}</p>
                <p className="mt-1 text-gray-700">Available: {kind.quantity}</p>
                <p className="pt-6 pb-2 mt-10 border-b border-gray-300 max-md:mt-8">
                  Description
                </p>
                <p className="mt-4 text-base leading-6 text-gray-600">{product.productDescription}</p>
              </div>
            )}
            <div className="mt-6 text-center">
              <QuantitySelector initialQuantity={1} onQuantityChange={(newQuantity) => setQuantity(newQuantity)} />
            </div>
          </section>
        </div>
      )}
    </main>
  );
}

function ProductDetail() {
  const { productId } = useParams();
  const [quantity, setQuantity] = useState(1);
  const [kindId, setKindId] = useState(null);

  const handleAddToCart = async (kindId, quantity) => {
    try {
      const response = await postCart({ id: kindId, quantity });
      const newItem = response.data.data;

      const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
      
      const existingItemIndex = cartItems.findIndex(item => item.id === newItem.id);

      if (existingItemIndex !== -1) {
        cartItems[existingItemIndex].quantity += newItem.quantity;
      } else {
        cartItems.push(newItem);
      }

      localStorage.setItem('cartItems', JSON.stringify(cartItems));
      toast.success('Add to cart successfully');
      console.log("Product added to cart:", newItem);
    } catch (error) {
      console.error("Failed to add product to cart:", error);
    }
  };

  return (
    <div className="flex flex-col bg-white">
      <div className="flex flex-col items-center w-full mt-[5rem] px-4">
        <MainContent productId={productId} onAddToCart={handleAddToCart} setKindId={setKindId} />
        <Button
          className="mt-8 px-8 py-3 mb-8 text-lg rounded-full shadow-lg"
          style={{
            backgroundColor: "#333333",
            color: "white",
          }}
          onClick={() => handleAddToCart(kindId, quantity)}
        >
          Add To Cart
        </Button>
      </div>
    </div>
  );
}

export default ProductDetail;
