import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllCategory } from '../../lib/service/categoryService';
import { getAllProductByCategoryId } from '../../lib/service/productService';

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
        setCategories(response.data.data); // Giả định `response.data` chứa danh sách danh mục
        
        // Gọi API để lấy sản phẩm cho mỗi danh mục
        const productFetchPromises = response.data.data.map(async (category) => {
          try {
            const productsResponse = await getAllProductByCategoryId(category.id);
            return { categoryId: category.id, products: productsResponse.data.data };
          } catch (productError) {
            console.error(`Error fetching products for category ${category.id}:`, productError);
            return { categoryId: category.id, products: [] };
          }
        });

        const productResults = await Promise.all(productFetchPromises);
        const productsMap = productResults.reduce((acc, { categoryId, products }) => {
          acc[categoryId] = products;
          return acc;
        }, {});
        
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
      <img
        loading="lazy"
        src="https://cdn.builder.io/api/v1/image/assets/TEMP/8c93821ba980000b83c02a7320d9bd20e9094bbc6ea1a02acc4ff34996276d85?apiKey=402c56a5a1d94d11bd24e7050966bb9d&"
        className="w-full"
        alt="Hero Banner"
      />
      <div className="p-6">
        <h2 className="text-center text-2xl font-bold my-6 font-mr-bedfort text-3xl">Our Collection</h2>
        <p className="text-center mb-10 font-light italic">
          Hãy để những đóa hoa nhung kèm và đất sét lưu niệm của chúng tôi thay
          lời muốn nói, mang đến niềm vui và kỷ niệm đẹp cho những người thân yêu
          của bạn.
        </p>
        {categories.map((category) => (
          <div className="mb-10 relative" key={category.id}>
            <h3 className="text-xl font-semibold mb-4">{category.categoryName}</h3>
            <button 
              className="absolute top-0 right-0 bg-transparent text-black flex items-center"
              onClick={() => handleSeeAll(category.id)}
            >
              <span className="font-bold">See all</span>
              <span className="ml-1">→</span>
            </button>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {productsByCategory[category.id]?.slice(0, 3).map((product) => (
                <img 
                  key={product.id}
                  src={product.image} 
                  alt={product.productName} 
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
