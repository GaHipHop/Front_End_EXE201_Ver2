import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllProduct } from '../../lib/service/productService';
import Header from '../layout/Header';

const formatPrice = (price) => {
  return price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
};

const ProductCard = ({ imgSrc, title, color, price, currentPrice, percent, productId }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/productDetail/${productId}`);
  };

  return (
    <div
      className="relative flex flex-col w-[65%] max-w-[300px] font-medium tracking-tight text-center text-black bg-white border border-gray-200 shadow-lg rounded-lg mx-2 cursor-pointer transition-transform transform hover:scale-105"
      onClick={handleClick}
    >
      {percent > 0 && (
        <div className="absolute top-0 left-0 bg-red-500 text-white text-sm px-2 py-1 rounded-tr-lg">
          {percent}%
        </div>
      )}
      <div className="flex justify-center">
        <img loading="lazy" src={imgSrc} alt={title} className="w-full h-54 object-cover rounded-t-lg" />
      </div>
      <div className="flex flex-col px-6 py-6">
        <span className="text-lg font-semibold">{title}</span>
        <span
          className={`text-xl ${currentPrice !== price ? 'line-through text-gray-500' : 'font-bold'}`}
          style={currentPrice !== price ? { fontSize: '1em' } : {}}
        >
          {formatPrice(price)}
        </span>
        {currentPrice !== price && (
          <div className="flex justify-center items-center mt-2">
            <span className="text-xl text-red-500 font-bold">{formatPrice(currentPrice)}</span>
          </div>
        )}
      </div>
    </div>
  );
};

const MainContent = ({ products }) => (
  <main className="flex flex-col items-center justify-center w-full max-w-[1354px] mx-auto mt-20">
    <section className="w-full mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {products.length > 0 ? (
        products.map((product, index) => (
          <ProductCard
            key={index}
            imgSrc={product.image}
            title={product.productName}
            color={product.colorName}
            price={product.productPrice}
            currentPrice={product.currentPrice !== 0 ? product.currentPrice : product.productPrice}
            percent={product.percent ? product.percent : 0}
            productId={product.id}
          />
        ))
      ) : (
        <div className="col-span-full text-center">No products available</div>
      )}
    </section>
    <div className="flex justify-center mt-8">
      <nav>
        <ul className="flex space-x-4">
          <li><a href="#" className="text-black hover:underline">1</a></li>
          <li><a href="#" className="text-black hover:underline">2</a></li>
          <li><a href="#" className="text-black hover:underline">3</a></li>
          <li><span>...</span></li>
        </ul>
      </nav>
    </div>
  </main>
);

const Product = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await getAllProduct();
        const data = response.data.data;
        console.log('Fetched Products:', data.result);
        setProducts(data);
      } catch (error) {
        console.error('Failed to fetch products:', error);
      }
    };

    fetchProducts();
  }, []);

  const handleCategorySelect = (selectedProducts) => {
    setProducts(selectedProducts);
  };

  return (
    <div className="flex flex-col bg-white">
      <Header onCategorySelect={handleCategorySelect} />
      <MainContent products={products}/>
    </div>
  );
};

export default Product;
