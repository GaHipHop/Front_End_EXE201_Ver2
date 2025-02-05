import TuneIcon from "@mui/icons-material/Tune";
import { IconButton, Menu, MenuItem, Pagination, Stack } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  getAllProduct,
  getAllProductByCategoryId,
} from "../../lib/service/productService";

const formatPrice = (price) => {
  return price.toLocaleString("vi-VN", { style: "currency", currency: "VND" });
};

const ProductCard = ({
  imgSrc,
  title,
  color,
  price,
  currentPrice,
  percent,
  productId,
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

const MainContent = ({
  products,
  page,
  pageSize,
  onPageChange,
  onSortChange,
  sortAnchorEl,
  handleMenuOpen,
  handleMenuClose,
}) => {
  const startIndex = (page - 1) * pageSize;
  const paginatedProducts = products.slice(startIndex, startIndex + pageSize);

  return (
    <main className="flex flex-col items-center justify-center w-full max-w-[1354px] mx-auto mt-20">
      <div className="flex justify-between items-center w-full mb-6 px-4 mt-10">
        <h2 className="text-4xl font-playfair-display-sc">SOUVENIR</h2>
        <div>
          <IconButton onClick={handleMenuOpen}>
            <TuneIcon fontSize="large" />
          </IconButton>
          <Menu
            anchorEl={sortAnchorEl}
            open={Boolean(sortAnchorEl)}
            onClose={handleMenuClose}
          >
            <MenuItem onClick={() => onSortChange("default")}>Default</MenuItem>
            <MenuItem onClick={() => onSortChange("price-up")}>
              Price Up
            </MenuItem>
            <MenuItem onClick={() => onSortChange("price-down")}>
              Price Down
            </MenuItem>
          </Menu>
        </div>
      </div>
      <section className="flex justify-center flex-wrap gap-10">
        {paginatedProducts.length > 0 ? (
          paginatedProducts.map((product, index) => (
            <ProductCard
              key={index}
              imgSrc={product.image}
              title={product.productName}
              color={product.colorName}
              price={product.productPrice}
              currentPrice={
                product.currentPrice !== 0
                  ? product.currentPrice
                  : product.productPrice
              }
              percent={product.percent ? product.percent : 0}
              productId={product.id}
            />
          ))
        ) : (
          <div className="col-span-full text-center">No products available</div>
        )}
      </section>
      <Stack spacing={3} className="mt-8">
        <Pagination
          count={Math.ceil(products.length / pageSize)}
          page={page}
          onChange={(event, value) => onPageChange(value)}
          siblingCount={1}
          boundaryCount={1}
          showFirstButton
          showLastButton
        />
      </Stack>
    </main>
  );
};

const Product = () => {
  const { categoryId } = useParams();
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [sortAnchorEl, setSortAnchorEl] = useState(null);
  const [sortedProducts, setSortedProducts] = useState([]);
  const pageSize = 6;
  const location = useLocation();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const searchParams = new URLSearchParams(location.search);
        const search = searchParams.get("search") || "";
        let data;
        if (categoryId) {
          const response = await getAllProductByCategoryId(categoryId);
          data = response.data.data;
        } else {
          const response = await getAllProduct();
          data = response.data.data;
        }
        if (search) {
          data = data.filter((product) =>
            product.productName.toLowerCase().includes(search.toLowerCase())
          );
        }
        setProducts(data);
        setSortedProducts(data);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      }
    };

    fetchProducts();
  }, [categoryId, location.search]);

  const handleMenuOpen = (event) => {
    setSortAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setSortAnchorEl(null);
  };

  const handleSortChange = (sortType) => {
    let sorted = [...products];
    if (sortType === "price-up") {
      sorted.sort((a, b) => a.currentPrice - b.currentPrice);
    } else if (sortType === "price-down") {
      sorted.sort((a, b) => b.currentPrice - a.currentPrice);
    } else {
      sorted = [...products];
    }
    setSortedProducts(sorted);
    setPage(1);
    handleMenuClose();
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  return (
    <div className="flex flex-col bg-white">
      <MainContent
        products={sortedProducts}
        page={page}
        pageSize={pageSize}
        onPageChange={handlePageChange}
        onSortChange={handleSortChange}
        sortAnchorEl={sortAnchorEl}
        handleMenuOpen={handleMenuOpen}
        handleMenuClose={handleMenuClose}
      />
    </div>
  );
};

export default Product;
