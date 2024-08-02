import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import imgURL from "src/assets/image/8c93821ba980000b83c02a7320d9bd20e9094bbc6ea1a02acc4ff34996276d85.png";
import { getAllCategory } from "../../lib/service/categoryService";
import { getAllProductByCategoryId } from "../../lib/service/productService";

const formatPrice = (price) => {
  return price.toLocaleString("vi-VN", { style: "currency", currency: "VND" });
};

const ProductCard = ({
  imgSrc,
  title,
  productId,
  percent,
  currentPrice,
  price,
}) => {
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
        <img
          loading="lazy"
          src={imgSrc}
          alt={title}
          className="w-full h-54 object-cover rounded-t-lg"
        />
      </div>
      <div className="flex flex-col px-6 py-6">
        <span className="text-lg font-semibold">{title}</span>
        <span
          className={`text-xl ${
            currentPrice !== price ? "line-through text-gray-500" : "font-bold"
          }`}
          style={currentPrice !== price ? { fontSize: "1em" } : {}}
        >
          {formatPrice(price)}
        </span>
        {currentPrice !== price && (
          <div className="flex justify-center items-center mt-2">
            <span className="text-xl text-red-500 font-bold">
              {formatPrice(currentPrice)}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

function Home() {
  const [categories, setCategories] = useState([]);
  const [productsByCategory, setProductsByCategory] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getAllCategory();
        setCategories(response.data.data); // Assuming response.data contains the category list

        // Fetch products for each category
        const productFetchPromises = response.data.data.map(
          async (category) => {
            try {
              const productsResponse = await getAllProductByCategoryId(
                category.id
              );
              return {
                categoryId: category.id,
                products: productsResponse.data.data,
              };
            } catch (productError) {
              console.error(
                `Error fetching products for category ${category.id}:`,
                productError
              );
              return { categoryId: category.id, products: [] };
            }
          }
        );

        const productResults = await Promise.all(productFetchPromises);
        const productsMap = productResults.reduce(
          (acc, { categoryId, products }) => {
            acc[categoryId] = products;
            return acc;
          },
          {}
        );

        setProductsByCategory(productsMap);
      } catch (categoryError) {
        setError(categoryError.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleSeeAll = (categoryId) => {
    navigate(`/products/${categoryId}`);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="flex flex-col bg-white">
      <img loading="lazy" src={imgURL} className="w-full" alt="Hero Banner" />
      <div className="p-6">
        <h2 className="text-center text-3xl font-bold my-6 font-mr-bedfort">
          Our Collection
        </h2>
        <p className="text-center mb-10 font-light italic">
          Let our velvet flowers and clay souvenirs do the talking words to say,
          bringing joy and beautiful memories to loved ones your love.
        </p>
        {categories.map((category) => (
          <div className="mb-10 relative" key={category.id}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">
                {category.categoryName}
              </h3>
              <button
                className="text-black font-bold flex items-center"
                onClick={() => handleSeeAll(category.id)}
              >
                <span>See all</span>
                <span className="ml-1">→</span>
              </button>
            </div>
            <div className="flex justify-center flex-wrap">
              {productsByCategory[category.id]?.slice(0, 3).map((product) => (
                <ProductCard
                  key={product.id}
                  imgSrc={product.image}
                  title={product.productName}
                  price={product.productPrice}
                  currentPrice={
                    product.currentPrice !== 0
                      ? product.currentPrice
                      : product.productPrice
                  }
                  percent={product.percent ? product.percent : 0}
                  productId={product.id}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;
