// src/components/pages/Home.jsx
import React from 'react';

function Home() {
  return (
    <div className="flex flex-col bg-white">
      <img
        loading="lazy"
        src="https://cdn.builder.io/api/v1/image/assets/TEMP/8c93821ba980000b83c02a7320d9bd20e9094bbc6ea1a02acc4ff34996276d85?apiKey=402c56a5a1d94d11bd24e7050966bb9d&"
        className="w-full"
        alt="Hero Banner"
      />
    </div>
  );
}

export default Home;
